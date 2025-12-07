
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUp, Loader, MoreVertical, Phone, Video, Copy, Check } from 'lucide-react';
import { GoogleGenAI, Chat } from "@google/genai";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

const ChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSession = useRef<Chat | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Chào bạn! Mình là My, trợ lý học tập của bạn.', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSession.current = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
             systemInstruction: "Bạn là My, trợ lý AI hỗ trợ học tập tại VTC Education. Hãy trả lời ngắn gọn, thân thiện và hữu ích. Tập trung vào việc giải thích các khái niệm phức tạp một cách đơn giản.",
          }
        });
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };
    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: userText,
        sender: 'user',
        time: currentTime
    }]);
    setInput('');
    setIsLoading(true);
    
    try {
        if (!chatSession.current) throw new Error("Chat session not initialized");
        const response = await chatSession.current.sendMessage({ message: userText });
        const botText = response.text || "Xin lỗi, mình không thể trả lời ngay bây giờ.";

        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            text: botText,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

    } catch (error) {
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            text: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate('/home')}>
                <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
                <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkJm1ruBZ5ENO52OIJEcayeFM7Cknu_xNfeosC5eFjVLlcdcwroYzo3Y9xgJ3ruqmWBfXyf1D_YTk8xvdJX4tEfLPLfS6ZwXSJtn_jcQJ6AqoTue90ClYZnFjKMnxMM3tBlbRYbX4cqmBuGtW7f2XRYncOC9H8K4k22W3UAy1OWpPZQcMH0utimZ9opyAAiTFaNBqrn8rfEFCoQjuiEEa6hdayBGagYpLhhzjwMTumhyxnkHOVQshsxnIUhYTZObEYO1mept7ZelM" 
                    className="w-10 h-10 rounded-full"
                    alt="My"
                />
                <div>
                    <div className="font-bold text-gray-900">My</div>
                    <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span className="text-xs text-gray-500">{isLoading ? 'Đang soạn tin...' : 'Online'}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex gap-4 text-gray-500">
            <Phone size={24} />
            <Video size={24} />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 pb-20">
        {messages.map((msg) => (
            <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
                <div 
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed relative group ${
                        msg.sender === 'user' 
                        ? 'bg-gray-200 text-gray-900 rounded-br-none' 
                        : 'bg-white text-gray-900 shadow-sm rounded-bl-none border border-gray-100'
                    }`}
                >
                    {msg.text}
                </div>
                <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                    <button 
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="text-gray-300 hover:text-gray-600 transition-colors p-1"
                        title="Copy message"
                    >
                        {copiedId === msg.id ? <Check size={12} className="text-green-500"/> : <Copy size={12}/>}
                    </button>
                </div>
            </div>
        ))}
        
        {/* Typing Indicator */}
        {isLoading && (
            <div className="flex flex-col items-start space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center gap-1.5 min-w-[60px] h-[46px]">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                 </div>
                 <span className="text-[10px] text-gray-400 ml-1">My đang soạn tin...</span>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 bg-white fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20">
        <div id="chat-input" className="flex items-center bg-gray-100 rounded-full px-2 py-1">
            <button className="p-2 text-gray-500"><MoreVertical size={20}/></button>
            <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Lo gì để VTC lo?"
                disabled={isLoading}
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 text-sm placeholder-gray-400"
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary text-white rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 transition-all hover:bg-orange-700"
            >
                {isLoading ? <Loader size={16} className="animate-spin" /> : <ArrowUp size={18} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
