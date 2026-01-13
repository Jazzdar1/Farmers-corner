
import React, { useState, useRef } from 'react';
import { ArrowLeft, Image, Video, Send, Heart, MessageSquare, MapPin, User, CheckCircle } from 'lucide-react';
import { CommunityMessage, Language } from '../types';
import { translations } from '../locales';

interface CommunityChatProps {
  onBack: () => void;
  language: Language;
}

const INITIAL_MESSAGES: CommunityMessage[] = [
  {
    id: '1',
    author: 'Ghulam Nabi',
    location: 'Shopian',
    text: 'Started high density plantation this season. The Gala varieties are looking promising! Anyone else tried the M9 rootstock?',
    mediaUrl: 'https://images.unsplash.com/photo-1620608034057-73d75c92842c?auto=format&fit=crop&q=80&w=600',
    mediaType: 'image',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    likes: 24,
    comments: 5
  },
  {
    id: '2',
    author: 'Feroz Ahmad',
    location: 'Sopore',
    text: 'Early signs of mites in the upper blocks. Suggesting everyone to keep a check on moisture levels.',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    likes: 12,
    comments: 2
  }
];

export const CommunityChat: React.FC<CommunityChatProps> = ({ onBack, language }) => {
  const [messages, setMessages] = useState<CommunityMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [attachedMedia, setAttachedMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[language];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      setAttachedMedia({ url, type });
    }
  };

  const handlePost = () => {
    if (!inputText.trim() && !attachedMedia) return;

    const newMessage: CommunityMessage = {
      id: Date.now().toString(),
      author: 'You',
      location: 'Your Location',
      text: inputText,
      mediaUrl: attachedMedia?.url,
      mediaType: attachedMedia?.type,
      timestamp: Date.now(),
      likes: 0,
      comments: 0
    };

    setMessages([newMessage, ...messages]);
    setInputText('');
    setAttachedMedia(null);
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-medium">
          <ArrowLeft className={`w-5 h-5 ${t.dir === 'rtl' ? 'rotate-180' : ''}`} /> {t.back}
        </button>
        <h2 className="font-bold text-gray-900">{t.communityTitle}</h2>
        <div className="w-8" />
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Posting Area */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm p-4 border border-gray-100">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <User className="text-green-600 w-6 h-6" />
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.postPlaceholder}
              className="flex-1 bg-gray-50 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-100 resize-none h-24"
            />
          </div>
          
          {attachedMedia && (
            <div className="mt-4 relative rounded-2xl overflow-hidden border border-gray-100 max-h-48">
              {attachedMedia.type === 'image' ? (
                <img src={attachedMedia.url} alt="Attached" className="w-full h-full object-cover" />
              ) : (
                <video src={attachedMedia.url} className="w-full h-full object-cover" controls />
              )}
              <button 
                onClick={() => setAttachedMedia(null)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="flex gap-4">
              <button 
                onClick={() => { if(fileInputRef.current) { fileInputRef.current.accept = 'image/*'; fileInputRef.current.click(); } }}
                className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors text-sm font-medium"
              >
                <Image className="w-5 h-5" /> {language === 'en' ? 'Photo' : t.shareMedia}
              </button>
              <button 
                onClick={() => { if(fileInputRef.current) { fileInputRef.current.accept = 'video/*'; fileInputRef.current.click(); } }}
                className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors text-sm font-medium"
              >
                <Video className="w-5 h-5" /> {language === 'en' ? 'Video' : t.shareMedia}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            </div>
            <button 
              onClick={handlePost}
              disabled={!inputText.trim() && !attachedMedia}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> {t.postBtn}
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="text-gray-400 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm">{msg.author}</h4>
                    {msg.author === 'You' && <CheckCircle className="w-3 h-3 text-blue-500" />}
                    <span className="text-[10px] text-gray-400 font-medium">• {formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <MapPin className="w-3 h-3" /> {msg.location}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>

              {msg.mediaUrl && (
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  {msg.mediaType === 'image' ? (
                    <img src={msg.mediaUrl} alt="Post content" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <video src={msg.mediaUrl} className="w-full h-full object-cover" controls />
                  )}
                </div>
              )}

              <div className="px-4 py-3 border-t flex items-center gap-6">
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors text-xs font-bold">
                  <Heart className="w-4 h-4" /> {msg.likes}
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors text-xs font-bold">
                  <MessageSquare className="w-4 h-4" /> {msg.comments}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
