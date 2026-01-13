
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Camera, ArrowLeft, MessageCircle, Loader2, Thermometer, CloudRain, Bug, Globe, ExternalLink, Star, Sprout, Info, Mic } from 'lucide-react';
import { DiagnosisResult, Language } from '../types';
import { translations } from '../locales';

interface ScanSessionProps {
  onBack: () => void;
  language: Language;
  onVoiceConsult: (prompt: string) => void;
}

export const ScanSession: React.FC<ScanSessionProps> = ({ onBack, language, onVoiceConsult }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => setImage(f.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setDiagnosis(null);
    setSources([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      const langName = language === 'ur' ? 'Urdu' : language === 'ks' ? 'Kashmiri' : language === 'hi' ? 'Hindi' : 'English';
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: `You are a Senior Horticultural Pathologist specialized in temperate fruits of the Kashmir Valley. 
            
Analyze the attached image of an apple leaf, branch, or fruit for signs of diseases or pest infestations typical to Kashmir (e.g., Apple Scab, Alternaria Leaf Blotch, European Red Mite, San Jose Scale, Powdery Mildew, or Marssonina Blotch).

First, perform a visual step-by-step examination:
1. Identify visual symptoms (lesions, discoloration, webbing, spots).
2. Correlate with common regional diseases.
3. Use Google Search to find the LATEST spray schedule/advisory (2024-2025) issued by SKUAST-K (Sher-e-Kashmir University of Agricultural Sciences and Technology of Kashmir).

Provide the final diagnosis in ${langName}.
Your entire response MUST be a single valid JSON object.
Format: 
{ 
  "problem": "Name of the disease/pest", 
  "severity": "Low/Medium/High", 
  "recommendation": "Step-by-step cultural and mechanical practices", 
  "pesticide": "Name of SKUAST-K recommended fungicide/insecticide and dosage per 100 liters of water", 
  "spraySchedule": "Ideal time to spray based on the current phenological stage of the orchard", 
  "weatherAdvisory": "Critical weather-based warning for the next 48 hours for spraying",
  "relatedIssues": [
    { "title": "Name of related issue 1", "description": "One sentence description of why it is related or how to spot it." },
    { "title": "Name of related issue 2", "description": "One sentence description of why it is related or how to spot it." }
  ]
}` }
          ]
        }],
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      
      if (result) {
        setDiagnosis(result);
      } else {
        throw new Error("Could not parse AI response");
      }
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        setSources(chunks.map((c: any) => c.web).filter(Boolean));
      }
    } catch (err) {
      console.error(err);
      alert("Analysis encountered an error. Please ensure the image is clear and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-medium hover:text-green-600 transition-colors">
          <ArrowLeft className={`w-5 h-5 ${t.dir === 'rtl' ? 'rotate-180' : ''}`} /> {t.back}
        </button>
        <h2 className="font-black text-gray-900 tracking-tight">{t.scanBtn}</h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
        <div className="max-w-2xl mx-auto space-y-6">
          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-4 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all group bg-white shadow-xl shadow-green-900/5"
            >
              <div className="bg-green-100 p-10 rounded-[2.5rem] group-hover:scale-110 transition-transform">
                <Camera className="w-20 h-20 text-green-600" />
              </div>
              <p className="mt-8 font-black text-gray-400 uppercase tracking-[0.2em] text-sm group-hover:text-green-600">{t.uploadPhoto}</p>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" capture="environment" />
            </div>
          ) : (
            <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl ring-8 ring-white">
                <img src={image} alt="Upload" className="w-full object-cover max-h-[600px]" />
                <button 
                  onClick={() => { setImage(null); setDiagnosis(null); }} 
                  className="absolute top-6 right-6 bg-black/50 backdrop-blur-md text-white p-4 rounded-full hover:bg-red-500 transition-colors shadow-lg"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>

              {!diagnosis && !isAnalyzing && (
                <button 
                  onClick={analyzeImage}
                  className="w-full bg-green-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-green-900/20 hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                  <Bug className="w-6 h-6" /> START PATHOLOGY ANALYSIS
                </button>
              )}

              {isAnalyzing && (
                <div className="text-center py-16 bg-white rounded-[3rem] border border-gray-100 shadow-2xl animate-pulse">
                  <div className="relative inline-block mb-6">
                    <Loader2 className="animate-spin text-green-600 w-16 h-16" />
                    <Star className="w-6 h-6 text-yellow-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <p className="font-black text-gray-400 uppercase tracking-[0.3em] text-xs">AI Pathologist is thinking...</p>
                  <p className="text-gray-400 text-xs mt-2 font-medium">Checking SKUAST-K Guidelines</p>
                </div>
              )}

              {diagnosis && (
                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-green-50 animate-in slide-in-from-bottom-8 duration-700">
                  <div className="bg-gradient-to-br from-green-600 to-green-800 p-10 text-white relative overflow-hidden">
                    <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center justify-between relative z-10 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-loose opacity-80">{t.report}</span>
                      </div>
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${diagnosis.severity === 'High' ? 'bg-red-500 shadow-xl shadow-red-900/40' : 'bg-green-500 shadow-xl shadow-green-900/20'}`}>
                        {diagnosis.severity} SEVERITY
                      </span>
                    </div>
                    <h3 className="text-4xl font-black leading-tight relative z-10">{diagnosis.problem}</h3>
                  </div>
                  
                  <div className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-orange-50/50 p-8 rounded-[2.5rem] border border-orange-100 group hover:shadow-lg transition-all">
                        <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Bug className="w-6 h-6 text-orange-600" />
                        </div>
                        <h4 className="text-orange-900 font-black text-xs uppercase tracking-widest mb-3">{t.pesticide}</h4>
                        <p className="text-sm text-gray-700 leading-relaxed font-bold">{diagnosis.pesticide}</p>
                      </div>
                      <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 group hover:shadow-lg transition-all">
                        <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <CloudRain className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="text-blue-900 font-black text-xs uppercase tracking-widest mb-3">{t.schedule}</h4>
                        <p className="text-sm text-gray-700 leading-relaxed font-bold">{diagnosis.spraySchedule}</p>
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 group hover:shadow-lg transition-all">
                      <div className="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Sprout className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h4 className="text-emerald-900 font-black text-xs uppercase tracking-widest mb-3">Recommendation</h4>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">{diagnosis.recommendation}</p>
                    </div>

                    <div className="bg-yellow-50/50 p-8 rounded-[2.5rem] flex items-start gap-6 border border-yellow-100">
                      <div className="bg-yellow-100 p-4 rounded-2xl">
                        <Thermometer className="w-8 h-8 text-yellow-700" />
                      </div>
                      <div>
                        <h4 className="text-yellow-800 font-black text-xs uppercase tracking-widest mb-1">{t.weather}</h4>
                        <p className="text-sm text-yellow-900/80 font-bold leading-relaxed">{diagnosis.weatherAdvisory}</p>
                      </div>
                    </div>

                    {/* Related Issues Section */}
                    {diagnosis.relatedIssues && diagnosis.relatedIssues.length > 0 && (
                      <div className="space-y-6 pt-6">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Info className="w-4 h-4 text-green-600" /> Related Issues to Watch For
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {diagnosis.relatedIssues.map((issue, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
                              <div>
                                <h5 className="font-black text-gray-900 text-sm mb-1">{issue.title}</h5>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{issue.description}</p>
                              </div>
                              <button 
                                onClick={() => onVoiceConsult(`Tell me more about ${issue.title} in Kashmiri orchards.`)}
                                className="mt-auto flex items-center justify-center gap-2 py-3 bg-gray-50 text-green-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-50 transition-colors border border-green-100 shadow-sm"
                              >
                                <Mic className="w-3 h-3" /> Ask Voice Assistant
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sources.length > 0 && (
                      <div className="pt-8 border-t border-gray-100">
                        <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                          <Globe className="w-3 h-3" /> Grounded in Research
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {sources.map((source, idx) => (
                            <a 
                              key={idx} 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] bg-white hover:bg-green-50 text-gray-500 hover:text-green-700 px-5 py-2.5 rounded-full border border-gray-100 shadow-sm transition-all flex items-center gap-2 font-black"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {source.title.substring(0, 30)}...
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => window.open(`https://wa.me/916006086915?text=${encodeURIComponent(`Assalam Alaikum Dar Towseef Sahab,\n\nI just used the Farmers Corner AI for diagnosis:\n\n📌 Problem: ${diagnosis.problem}\n📉 Severity: ${diagnosis.severity}\n🧪 Recommendation: ${diagnosis.pesticide}\n\nPlease guide me further.`)}`, '_blank')} 
                      className="w-full py-6 bg-[#25D366] text-white