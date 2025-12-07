
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, CheckCircle, Presentation, Zap, Play } from 'lucide-react';

const LessonDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  const lessonContent = [
    { title: "1. Giới thiệu chung", time: "10:35", type: "main", progress: 100 },
    { title: "AI là gì trong 60s", time: "01:00", type: "video", progress: 100 },
    { title: "3 Loại hình AI cơ bản", time: "02:15", type: "video", progress: 75 },
    { title: "2. Lịch sử hình thành và phát triển", time: "15:12", type: "main", progress: 40 },
    { title: "Sự kiện Dartmouth 1956", time: "01:30", type: "video", progress: 0 },
    { title: "Mùa đông AI là gì?", time: "02:45", type: "video", progress: 0 },
    { title: "Kỷ nguyên Deep Learning", time: "03:10", type: "video", progress: 0 },
    { title: "3. Các ứng dụng của AI", time: "20:05", type: "main", progress: 0 },
    { title: "AI trong Y tế", time: "03:20", type: "video", progress: 0 },
    { title: "AI trong Giáo dục & Đào tạo", time: "02:50", type: "video", progress: 0 },
    { title: "4. Tổng kết bài học", time: "05:00", type: "main", progress: 0 }
  ];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col pb-10">
       <header className="flex items-center p-6 bg-white sticky top-0 z-30 shadow-sm rounded-b-[30px]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-900" />
        </button>
        <h1 className="flex-1 text-center font-bold text-gray-900 text-base px-4 truncate">
            Tổng quan về AI
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Video Player */}
        {isPlaying ? (
            <div className="aspect-video bg-black rounded-[30px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/P7k8gX_XjBc?autoplay=1&rel=0" 
                    title="Chuyển đổi số là gì?" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </div>
        ) : (
            <div 
                onClick={() => setIsPlaying(true)}
                className="aspect-video bg-gray-900 rounded-[30px] flex flex-col items-center justify-center text-white shadow-2xl relative overflow-hidden group cursor-pointer"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-black/50 z-10"></div>
                <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Thumbnail" />
                <div className="relative z-20 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 border border-white/30 group-hover:scale-110 transition-transform">
                        <Play size={28} fill="white" className="ml-1" />
                    </div>
                    <span className="text-sm font-bold tracking-wide">Xem Video Demo: Chuyển đổi số</span>
                </div>
            </div>
        )}

        {/* Content Tabs */}
        <div className="space-y-6">
            <div className="bg-white rounded-[30px] p-6 shadow-card border border-gray-50">
                <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="text-secondary" size={20} />
                    Mục tiêu học tập
                </h2>
                <ul className="space-y-3">
                    {[
                        "Định nghĩa & lịch sử phát triển AI.",
                        "Phân biệt AI hẹp, AI tổng quát và Siêu trí tuệ.",
                        "Ứng dụng AI trong thực tiễn."
                    ].map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-gray-600 font-medium items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></div>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="space-y-3">
                <h2 className="font-bold text-gray-900 text-lg px-2">Nội dung chi tiết</h2>
                {lessonContent.map((item, idx) => (
                    <div 
                        key={idx} 
                        className={`p-4 rounded-[20px] transition-all cursor-pointer group ${
                            item.type === 'video' 
                                ? 'bg-gradient-to-r from-orange-50 to-white border border-orange-100 shadow-sm hover:shadow-md' 
                                : 'bg-white border border-gray-100 hover:border-blue-200 shadow-card'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-4">
                                {item.type === 'video' ? (
                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <PlayCircle size={20} fill="currentColor" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                        <Presentation size={20} />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${item.type === 'video' ? 'text-gray-900' : 'text-gray-800'}`}>
                                        {item.title}
                                    </span>
                                    {item.type === 'video' && (
                                        <span className="text-[10px] text-primary font-extrabold uppercase tracking-wider mt-0.5">
                                            VIDEO
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-lg">{item.time}</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${item.progress === 100 ? 'bg-green-500' : item.type === 'video' ? 'bg-orange-500' : 'bg-blue-600'}`} 
                                style={{ width: `${item.progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                             <span className="text-[10px] text-gray-400 font-medium">Tiến độ</span>
                             <span className="text-[10px] text-gray-400 font-bold">{item.progress}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default LessonDetailScreen;
