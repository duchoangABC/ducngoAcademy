
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Settings, Flame, Star, Trophy, 
  HelpCircle, ChevronRight, Edit3, X, Award, MapPin, Briefcase,
  Users, Clock, Upload, Globe, Palette, Map, CalendarCheck, Landmark, Heart
} from 'lucide-react';
import CompetencyRadar from '../components/RadarChart';
import { useUser } from '../context/UserContext';

type Tab = 'competency' | 'achievement';

const predefinedAvatars = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDyyR9lROpAaKpEx3M7FWgsIQ1lJlfpEZCsfLFL_qY4F7bQnHn683n2rgC_3o9Fpzvb7My65x02vRnKdyKhgWHDW_-zDK8KGcIeY8YTCRIURCbFIJQxg_bPv6NuWIgctFh9O6H0ln9J6zC_NAHYzbhkCwAE89onHUbQQZyctAj3rvKZwgjvg_svB3emz_xTyQlzxKJ5aY62QICebZcJ0dXorwtpfC0icgMgB7YgUKpPhMeVAjI5__H3ls9xoVVOTM7AtHeKE2b5UlI",
    "https://i.pravatar.cc/150?img=12",
    "https://i.pravatar.cc/150?img=5",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=32",
    "https://i.pravatar.cc/150?img=60",
    "https://i.pravatar.cc/150?img=68",
    "https://i.pravatar.cc/150?img=10"
];

const badges = [
  { id: 1, name: 'Đại sứ Văn hóa', date: '15/03/2024', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 2, name: 'Sáng tạo Nghệ thuật', date: '10/02/2024', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-100' },
  { id: 3, name: 'Hướng dẫn viên 5 sao', date: '31/01/2024', icon: Map, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 4, name: 'Quản lý Sự kiện', date: '31/03/2024', icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 5, name: 'Am hiểu Di sản', date: '20/12/2023', icon: Landmark, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 6, name: 'Hoạt động Cộng đồng', date: '15/11/2023', icon: Heart, color: 'text-red-600', bg: 'bg-red-100' },
];

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('competency'); 
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    jobTitle: '',
    avatarUrl: ''
  });

  const handleOpenEdit = () => {
    setEditForm({
      name: user.name,
      jobTitle: (user as any).jobTitle || '',
      avatarUrl: user.avatarUrl
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: editForm.name,
      avatarUrl: editForm.avatarUrl,
      // @ts-ignore
      jobTitle: editForm.jobTitle
    });
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-gray-50 sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="text-gray-700 p-2">
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Trang cá nhân</h1>
        <button onClick={() => navigate('/menu')} className="text-gray-700 p-2 bg-gray-200 rounded-full">
            <Settings size={20} />
        </button>
      </header>

      <div className="flex flex-col items-center mt-2 px-6">
         {/* Avatar */}
         <div className="relative mb-3">
            <img 
                src={user.avatarUrl} 
                alt="Avatar" 
                className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
            />
            <button 
                onClick={handleOpenEdit}
                className="absolute bottom-0 right-0 bg-white text-gray-600 p-1.5 rounded-full shadow-md border border-gray-100 hover:text-primary"
            >
                <Edit3 size={14} />
            </button>
         </div>
         
         <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
         <p className="text-gray-500 text-sm mt-1">{(user as any).jobTitle}</p>

         {/* Quick Stats */}
         <div className="flex gap-4 mt-6 w-full max-w-xs">
            <div className="flex-1 bg-white p-3 rounded-2xl shadow-sm flex items-center justify-center gap-3">
                <Flame className="text-orange-500" size={24} fill="currentColor" />
                <div className="text-left">
                    <div className="font-bold text-gray-900">{user.streak}</div>
                    <div className="text-xs text-gray-500">Ngày streak</div>
                </div>
            </div>
            <div className="flex-1 bg-white p-3 rounded-2xl shadow-sm flex items-center justify-center gap-3">
                <Star className="text-yellow-400" size={24} fill="currentColor" />
                <div className="text-left">
                    <div className="font-bold text-gray-900">{user.points}</div>
                    <div className="text-xs text-gray-500">Điểm</div>
                </div>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-gray-200 flex">
        <button 
            onClick={() => setActiveTab('competency')}
            className={`flex-1 py-3 text-sm font-semibold text-center relative ${
                activeTab === 'competency' ? 'text-primary' : 'text-gray-500'
            }`}
        >
            Năng lực
            {activeTab === 'competency' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full mx-10"></div>}
        </button>
        <button 
            onClick={() => setActiveTab('achievement')}
            className={`flex-1 py-3 text-sm font-semibold text-center relative ${
                activeTab === 'achievement' ? 'text-primary' : 'text-gray-500'
            }`}
        >
            Thành tích
            {activeTab === 'achievement' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full mx-10"></div>}
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'competency' ? <CompetencyView /> : <AchievementView />}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Cập nhật thông tin</h3>
              <button onClick={() => setIsEditing(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Thông tin cơ bản</label>
                <input 
                    type="text" value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:border-primary" 
                    placeholder="Họ tên"
                />
                <input 
                    type="text" value={editForm.jobTitle}
                    onChange={(e) => setEditForm({...editForm, jobTitle: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" 
                    placeholder="Chức danh / Lớp"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ảnh đại diện</label>
                <div className="flex items-center gap-4 mb-4">
                    <img src={editForm.avatarUrl} alt="Preview" className="w-16 h-16 rounded-full border border-gray-200 object-cover" />
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-200 transition-colors text-gray-700">
                        <Upload size={16} />
                        <span>Tải ảnh lên</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
                
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Hoặc chọn từ thư viện</p>
                <div className="grid grid-cols-4 gap-2">
                    {predefinedAvatars.map((url, idx) => (
                        <button 
                            key={idx}
                            type="button"
                            onClick={() => setEditForm({...editForm, avatarUrl: url})}
                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${editForm.avatarUrl === url ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'}`}
                        >
                            <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
              </div>

              <div className="pt-2">
                  <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-700 transition-colors">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const CompetencyView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900 text-lg">Năng lực của tôi</h3>
          <p className="text-xs text-gray-500">Dữ liệu cập nhật từ hệ thống</p>
      </div>
      
      <div id="profile-radar" className="bg-orange-50/50 rounded-3xl p-4 border border-orange-100">
        <div className="flex justify-between items-center mb-4 px-2">
          <h4 className="font-bold text-gray-800 text-sm">Khung năng lực Công nghệ số & AI</h4>
          <HelpCircle size={18} className="text-gray-400" />
        </div>
        
        {/* Adjusted container to be responsive and not cut off the chart */}
        <div className="w-full flex justify-center mb-6">
            <CompetencyRadar />
        </div>

        <div className="flex justify-center gap-6 mt-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-red-400 rounded-full"></div>
            <span className="text-xs text-gray-500">Năng lực hiện tại</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-blue-400 rounded-full"></div>
            <span className="text-xs text-gray-500">Năng lực mục tiêu</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-center text-xs font-bold text-gray-400 uppercase mb-4">CHÚ THÍCH NĂNG LỰC</h5>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-600">
                 {[
                   "Kiến thức nền tảng AI", "Prompt Engineering", "Sáng tạo nội dung AI", "Phân tích dữ liệu số",
                   "An toàn & Bảo mật số", "Đạo đức & Pháp luật AI", "Giao tiếp & Hợp tác số", "Tư duy giải quyết vấn đề",
                   "Ứng dụng AI công việc", "Quản lý thông tin số", "Thích ứng & Tự học"
                 ].map((item, index) => (
                   <div key={index} className="flex">
                     <span className="font-bold mr-1">{index + 1}</span> {item}
                   </div>
                 ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const AchievementView: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
                <div>
                     <span className="text-xs text-gray-500">Chương trình đang tham gia</span>
                     <h3 className="font-bold text-gray-900 mt-1">Lộ trình học tập môn học</h3>
                     <span className="text-xs text-gray-400">2/27</span>
                </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '8%' }}></div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Users size={12}/> 2K+ người tham gia</span>
                <span className="flex items-center gap-1"><Clock size={12}/> Hết hạn sau 29 ngày</span>
            </div>
            <div className="text-center">
                <button onClick={() => navigate('/courses')} className="text-primary text-sm font-bold hover:underline">
                    Xem lộ trình học
                </button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                <Star className="text-yellow-400" size={24} fill="currentColor" />
                <div>
                    <div className="font-bold text-gray-900">{user.points}</div>
                    <div className="text-xs text-gray-500">Điểm</div>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                <Flame className="text-orange-500" size={24} fill="currentColor" />
                <div>
                    <div className="font-bold text-gray-900">{user.streak}</div>
                    <div className="text-xs text-gray-500">Ngày streak</div>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                <Trophy className="text-amber-600" size={24} />
                <div>
                    <div className="font-bold text-gray-900">85%</div>
                    <div className="text-xs text-gray-500">Tỉ lệ đúng</div>
                </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-xs">?</div>
                <div>
                    <div className="font-bold text-gray-900">142</div>
                    <div className="text-xs text-gray-500">Câu hỏi đã làm</div>
                </div>
            </div>
        </div>

        {/* Certificate */}
        <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-900">Chứng chỉ</h3>
                <button className="bg-gray-100 p-1.5 rounded-full"><Edit3 size={14} className="text-gray-500"/></button>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="aspect-[4/3] border-4 border-double border-yellow-200 rounded-lg flex flex-col items-center justify-center text-center p-4 bg-yellow-50/30 mb-3">
                    <Trophy className="text-yellow-500 mb-2" size={32} />
                    <div className="text-xs font-serif text-gray-500">CERTIFICATE OF COMPLETION</div>
                    <div className="font-bold text-gray-800 my-1">Data-driven product management</div>
                    <div className="text-xs text-gray-500">VTC Education</div>
                </div>
                <h4 className="font-bold text-sm">Data-driven product management by VTC Education</h4>
                <p className="text-xs text-gray-500">VTC Education</p>
                <p className="text-xs text-gray-400 mt-1">Được cấp ngày thg 12 2025</p>
            </div>
        </div>

        {/* Badges Grid */}
        <div>
             <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-gray-900">Huy hiệu đã đạt</h3>
                 <button onClick={() => navigate('/badges')} className="text-primary text-xs font-bold">Xem tất cả</button>
             </div>
             <div className="grid grid-cols-2 gap-3">
                {badges.slice(0, 4).map((badge) => (
                    <div key={badge.id} className="bg-white rounded-xl p-3 flex flex-col items-center text-center shadow-sm border border-gray-50">
                        <div className={`w-12 h-12 rounded-xl ${badge.bg} flex items-center justify-center mb-2 shadow-sm`}>
                            <badge.icon size={24} className={badge.color} />
                        </div>
                        <h4 className="font-bold text-gray-900 text-xs leading-tight mb-1">{badge.name}</h4>
                        <p className="text-[9px] text-gray-400">{badge.date}</p>
                    </div>
                ))}
             </div>
        </div>
      </div>
    );
};

export default ProfileScreen;
