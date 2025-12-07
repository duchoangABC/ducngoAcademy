
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Palette, Map, CalendarCheck, Landmark, Heart } from 'lucide-react';
import { useUser } from '../context/UserContext';

const badges = [
  { id: 1, name: 'Đại sứ Văn hóa', date: '15/03/2024', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 2, name: 'Sáng tạo Nghệ thuật', date: '10/02/2024', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-100' },
  { id: 3, name: 'Hướng dẫn viên 5 sao', date: '31/01/2024', icon: Map, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 4, name: 'Quản lý Sự kiện', date: '31/03/2024', icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 5, name: 'Am hiểu Di sản', date: '20/12/2023', icon: Landmark, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 6, name: 'Hoạt động Cộng đồng', date: '15/11/2023', icon: Heart, color: 'text-red-600', bg: 'bg-red-100' },
];

const BadgesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="flex items-center p-6 bg-white sticky top-0 z-10 shadow-sm rounded-b-[30px]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-900" />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-gray-900 mr-10">Thành tích cá nhân</h2>
      </header>
      
      {/* User Info Compact */}
      <div className="p-6 flex flex-col items-center">
         <div className="w-24 h-24 p-1 bg-white rounded-full shadow-md mb-3">
            <img 
                src={user.avatarUrl}
                alt="User"
                className="w-full h-full rounded-full object-cover"
            />
         </div>
         <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
         <div className="bg-blue-100 text-secondary px-3 py-0.5 rounded-full text-xs font-bold mt-1">{(user as any).jobTitle}</div>
      </div>

      {/* Grid */}
      <div className="px-6 pb-24 grid grid-cols-2 gap-4">
        {badges.map((badge) => (
            <div key={badge.id} className="bg-white rounded-[24px] p-5 flex flex-col items-center text-center shadow-card hover:shadow-lg transition-shadow border border-gray-50">
                <div className={`w-16 h-16 rounded-2xl ${badge.bg} flex items-center justify-center mb-4 shadow-sm`}>
                    <badge.icon size={32} className={badge.color} />
                </div>
                <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2 h-8 flex items-center">{badge.name}</h4>
                <p className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{badge.date}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesScreen;
