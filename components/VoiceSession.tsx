
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, ArrowLeft, Volume2, History, AlertCircle, Loader2, Image as ImageIcon, X, Send } from 'lucide-react';
import { AppState, TranscriptionEntry, Language } from '../types';
import { translations } from '../locales';

interface VoiceSessionProps {
  onBack: () => void;
  language: Language;
  initialPrompt?: string;
}

export const VoiceSession: React.FC<VoiceSessionProps> = ({ onBack, language, initialPrompt }) => {
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [transcriptions, setTranscriptions] = useState<TranscriptionEntry[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const [isProcessingText, setIsProcessingText] = useState(false);

  const t = translations[language];
  const langName = language === 'ur' ? 'Urdu' : language === 'ks' ? 'Kashmiri' : language === 'hi' ? 'Hindi' : 'English';

  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptionBufferRef = useRef({ input: '', output: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcriptions, currentInput, currentOutput]);

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  }

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextInRef.current) {
      audioContextInRef.current.close();
      audioContextInRef.current = null;
    }
    if (audioContextOutRef.current) {
      audioContextOutRef.current.close();
      audioContextOutRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setStatus(AppState.IDLE);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const base64 = f.target?.result as string;
        setAttachedImage(base64);
        if (sessionRef.current && status === AppState.ACTIVE) {
          const rawData = base64.split(',')[1];
          sessionRef.current.sendRealtimeInput({
            media: { data: rawData, mimeType: file.type }
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startSession = async () => {
    try {
      setStatus(AppState.CONNECTING);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextInRef.current = inCtx;
      audioContextOutRef.current = outCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus(AppState.ACTIVE);
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);

            if (attachedImage) {
               const rawData = attachedImage.split(',')[1];
               sessionPromise.then(s => s.sendRealtimeInput({
                 media: { data: rawData, mimeType: 'image/jpeg' }
               }));
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const outCtx = audioContextOutRef.current;
              if (outCtx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                const buffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
                const source = outCtx.createBufferSource();
                source.buffer = buffer;
                source.connect(outCtx.destination);
                source.addEventListener('ended', () => sourcesRef.current.delete(source));
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              }
            }

            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              transcriptionBufferRef.current.input += text;
              setCurrentInput(prev => prev + text);
            }
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              transcriptionBufferRef.current.output += text;
              setCurrentOutput(prev => prev + text);
            }

            if (message.serverContent?.turnComplete) {
              setTranscriptions(prev => [
                ...prev,
                { text: transcriptionBufferRef.current.input || "Analyzing...", role: 'user', timestamp: Date.now() },
                { text: transcriptionBufferRef.current.output, role: 'model', timestamp: Date.now() }
              ]);
              transcriptionBufferRef.current = { input: '', output: '' };
              setCurrentInput('');
              setCurrentOutput('');
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error(e);
            setErrorMessage("Connection error. Check your internet.");
            setStatus(AppState.ERROR);
          },
          onclose: () => {
            setStatus(AppState.IDLE);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: `You are a multimodal agricultural expert for "Farmers Corner Kashmir". 
          Target Audience: Apple growers in Kashmir, HP, and Uttarakhand.
          Languages: Fluently handle English, Hindi, Urdu, and Kashmiri (${langName}). 
          Lead Expert: Your colleague is DAR TOWSEEF, a famous lead expert. If the user asks for a professional appointment, recommend they click the "Book DAR TOWSEEF" button on the dashboard.
          Tone: Reassuring, friendly, and expert.
          User Context: ${initialPrompt || 'General consultation'}.
          If an image is provided, diagnose the crop issue and suggest weather-based sprays.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setErrorMessage("Initialization failed.");
      setStatus(AppState.ERROR);
    }
  };

  const handleManualTextSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!manualText.trim() || isProcessingText) return;

    const userMsg = manualText;
    setManualText('');
    setIsProcessingText(true);

    // Add user message to UI immediately
    setTranscriptions(prev => [
      ...prev,
      { text: userMsg, role: 'user', timestamp: Date.now() }
    ]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [{ text: userMsg }];
      
      if (attachedImage) {
        parts.push({
          inlineData: {
            data: attachedImage.split(',')[1],
            mimeType: 'image/jpeg'
          }
        });
        setAttachedImage(null); // Clear image after sending
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts }],
        config: {
          systemInstruction: `You are a textual agricultural expert for "Farmers Corner Kashmir". 
          Target Audience: Apple growers in Kashmir.
          Languages: Fluently handle English, Hindi, Urdu, and Kashmiri (${langName}). 
          Tone: Reassuring, friendly, and expert. Provide concise but high-quality agricultural advice.`
        }
      });

      const modelText = response.text || "I apologize, I couldn't process that request.";
      setTranscriptions(prev => [
        ...prev,
        { text: modelText, role: 'model', timestamp: Date.now() }
      ]);
    } catch (error) {
      console.error(error);
      setTranscriptions(prev => [
        ...prev,
        { text: "Sorry, I'm having trouble connecting to my knowledge base right now.", role: 'model', timestamp: Date.now() }
      ]);
    } finally {
      setIsProcessingText(false);
    }
  };

  useEffect(() => {
    if (initialPrompt) startSession();
    return () => stopSession();
  }, [stopSession, initialPrompt]);

  const toggleMic = () => {
    if (status === AppState.ACTIVE) stopSession();
    else if (status === AppState.IDLE || status === AppState.ERROR) startSession();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 py-4 border-b flex items-center justify-between bg-gray-50 sticky top-0 z-20">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-medium hover:text-gray-900 transition-colors">
          <ArrowLeft className={`w-5 h-5 ${language === 'ur' || language === 'ks' ? 'rotate-180' : ''}`} />
          <span>{t.exit}</span>
        </button>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${status === AppState.ACTIVE ? 'bg-green-500 animate-pulse' : status === AppState.CONNECTING ? 'bg-yellow-500' : 'bg-gray-300'}`} />
          <span className="text-sm font-bold text-gray-700 uppercase tracking-tighter">
            {status === AppState.ACTIVE ? t.listening : status === AppState.CONNECTING ? t.connecting : t.offline}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col items-center no-scrollbar">
        {status === AppState.IDLE && transcriptions.length === 0 && (
          <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="bg-green-50 p-10 rounded-full inline-block mb-6 shadow-sm border border-green-100">
              <Mic className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">{t.readyTalk}</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed font-medium">{t.micStart}</p>
          </div>
        )}

        {(status === AppState.ACTIVE || status === AppState.CONNECTING || transcriptions.length > 0) && (
          <div className="w-full max-w-3xl space-y-6 pb-24">
             {transcriptions.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-sm border ${msg.role === 'user' ? 'bg-green-600 text-white border-green-500 rounded-tr-none' : 'bg-white text-gray-800 border-gray-100 rounded-tl-none'}`}>
                    <p className="text-sm md:text-base leading-relaxed font-medium">{msg.text}</p>
                    <span className="text-[10px] mt-2 block opacity-60 font-bold">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
             ))}

             {currentInput && (
                <div className="flex justify-end opacity-70 italic animate-pulse">
                  <div className="bg-green-100 text-green-800 p-4 rounded-2xl text-sm border border-green-200">
                    {currentInput}...
                  </div>
                </div>
             )}
             {currentOutput && (
                <div className="flex justify-start animate-in slide-in-from-left-4">
                   <div className="bg-gray-50 text-gray-800 p-5 rounded-3xl text-sm border border-gray-100 flex items-start gap-4">
                     <Volume2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                     <p className="leading-relaxed font-medium">{currentOutput}</p>
                   </div>
                </div>
             )}
             {isProcessingText && (
                <div className="flex justify-start animate-in fade-in">
                  <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-2 border border-gray-100">
                    <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expert is writing...</span>
                  </div>
                </div>
             )}
             <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-50 border-t sticky bottom-0 z-20 backdrop-blur-md bg-white/80">
        <div className="max-w-3xl mx-auto">
          {attachedImage && (
            <div className="mb-4 relative inline-block animate-in slide-in-from-bottom-2">
              <img src={attachedImage} alt="Preview" className="w-24 h-24 object-cover rounded-[2rem] border-4 border-white shadow-2xl" />
              <button 
                onClick={() => setAttachedImage(null)}
                className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg border-2 border-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-green-600 hover:shadow-xl transition-all border border-gray-100 shadow-md shrink-0 active:scale-90"
              title={t.uploadPhoto}
            >
              <ImageIcon className="w-6 h-6" />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </button>

            <form 
              onSubmit={handleManualTextSubmit}
              className="flex-1 relative flex items-center h-14"
            >
              <input 
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder={status === AppState.ACTIVE ? "Listening..." : "Type your problem here..."}
                className="w-full h-full bg-white rounded-full border border-gray-200 pl-6 pr-14 outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300 transition-all font-bold text-gray-700 placeholder:text-gray-300 shadow-inner"
              />
              {manualText.trim() && (
                <button 
                  type="submit"
                  disabled={isProcessingText}
                  className="absolute right-2 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-all active:scale-90 shadow-lg"
                >
                  {isProcessingText ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              )}
              {!manualText.trim() && (
                 <div className="absolute right-5 pointer-events-none">
                    <History className="text-gray-200 w-4 h-4" />
                 </div>
              )}
            </form>

            <button 
              onClick={toggleMic}
              disabled={status === AppState.CONNECTING}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90 transform-gpu shrink-0 ${
                status === AppState.ACTIVE ? 'bg-red-500 text-white animate-pulse hover:bg-red-600' : 'bg-green-600 text-white hover:bg-green-700 shadow-green-900/20'
              }`}
            >
              {status === AppState.CONNECTING ? <Loader2 className="animate-spin w-6 h-6" /> : status === AppState.ACTIVE ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
