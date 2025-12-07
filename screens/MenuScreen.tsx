
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronDown, ChevronRight, Home, Compass, User, Bookmark, Clock, Users, ShieldCheck } from 'lucide-react';
import { useUser } from '../context/UserContext';

const MenuScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isProgramExpanded, setIsProgramExpanded] = useState(true);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="p-4 flex justify-end">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <X size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        
        {/* Program */}
        <div className="mb-6">
            <button 
                onClick={() => setIsProgramExpanded(!isProgramExpanded)}
                className="w-full flex justify-between items-center mb-3"
            >
                <h2 className="text-lg font-bold text-gray-900">Chương trình đang học</h2>
                <ChevronDown size={20} className={`text-gray-500 transition-transform ${isProgramExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {isProgramExpanded && (
                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2">Công nghệ số và Ứng dụng trí tuệ nhân tạo</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <div className="flex -space-x-2">
                                <img src="https://i.pravatar.cc/100?img=1" className="w-5 h-5 rounded-full border border-white"/>
                                <img src="https://i.pravatar.cc/100?img=2" className="w-5 h-5 rounded-full border border-white"/>
                            </div>
                            <span>2K+ người tham gia</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>Hết hạn sau 29 ngày</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Menu Items */}
        <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Menu</h2>
            <div className="space-y-1">
                {[
                    { icon: Home, label: 'Trang chủ', path: '/home' },
                    { icon: Compass, label: 'Lộ trình học cá nhân hoá', path: '/courses' },
                    { icon: User, label: 'Trang cá nhân', path: '/profile' },
                    { icon: Bookmark, label: 'Nội dung đã lưu', path: '#' },
                    { icon: ShieldCheck, label: 'CMS Admin Panel', path: '/admin' },
                ].map((item, idx) => (
                    <button 
                        key={idx}
                        onClick={() => item.path !== '#' && navigate(item.path)}
                        className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <item.icon size={22} className={`${item.path === '/admin' ? 'text-orange-600' : 'text-gray-500'} mr-3`} />
                        <span className={`flex-1 text-left font-medium ${item.path === '/admin' ? 'text-orange-700' : 'text-gray-800'}`}>{item.label}</span>
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>
                ))}
            </div>
        </div>

        {/* Upcoming */}
        <div className="pb-10">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Các môn dự kiến kỳ sau</h2>
            <div className="space-y-4">
                {[
                    'Kỹ năng thuyết trình chuyên nghiệp',
                    'Kỹ năng lập trình Vibecoding',
                    'Kỹ năng AI trong ngành Du lịch'
                ].map((course, idx) => (
                    <div key={idx} className="text-gray-700 font-medium hover:text-primary cursor-pointer">
                        {course}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MenuScreen;
