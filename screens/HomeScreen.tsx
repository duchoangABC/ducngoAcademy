import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MessageCircle, PlayCircle, Zap, Target, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
        {/* Simple Header */}
        <header className="bg-white p-6 pb-4 sticky top-0 z-10 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">Chào, {user.name}!</h1>
        </header>
        
        <main className="p-6 space-y-4">
            {/* Entry Test CTA - Show if not taken */}
            {!user.hasTakenEntryTest && (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-2xl shadow-lg shadow-indigo-200 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Target size={100} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="font-bold text-lg mb-1">Kiểm tra đầu vào</h2>
                        <p className="text-indigo-100 text-xs mb-4 max-w-[80%]">Làm bài test ngắn để AI xây dựng lộ trình cá nhân hóa cho bạn.</p>
                        <button 
                            onClick={() => navigate('/entry-test')}
                            className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors"
                        >
                            Bắt đầu ngay <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Action Cards */}
            <div id="home-profile-card" onClick={() => navigate('/profile')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-primary">
                    <User size={24} />
                </div>
                <div>
                    <h2 className="font-bold text-gray-900">Hồ sơ cá nhân</h2>
                    <p className="text-sm text-gray-500">Xem tiến độ & năng lực</p>
                </div>
            </div>

            <div onClick={() => navigate('/courses')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-secondary">
                    <PlayCircle size={24} />
                </div>
                <div>
                    <h2 className="font-bold text-gray-900">Tiếp tục học</h2>
                    <p className="text-sm text-gray-500">Bài học đang dang dở</p>
                </div>
            </div>

            <div onClick={() => navigate('/chat')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <MessageCircle size={24} />
                </div>
                <div>
                    <h2 className="font-bold text-gray-900">Chat với Mentor</h2>
                    <p className="text-sm text-gray-500">Hỗ trợ học tập 24/7</p>
                </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                <div className="flex items-center gap-2 mb-2">
                    <Zap size={18} className="text-yellow-500" fill="currentColor" />
                    <h3 className="font-bold text-gray-800">Mẹo học tập</h3>
                </div>
                <p className="text-sm text-gray-600">Hãy dành 15 phút mỗi ngày để ôn tập kiến thức cũ nhé!</p>
            </div>
        </main>
    </div>
  );
};

export default HomeScreen;