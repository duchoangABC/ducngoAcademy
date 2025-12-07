
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, GitBranch, FileQuestion, Users, LogOut, Settings, Library, BookMarked, Bot, UserCog } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', path: '/admin' },
    { icon: Library, label: 'Quản lý nội dung', path: '/admin/content' },
    { icon: GitBranch, label: 'Học tập thích ứng', path: '/admin/adaptive' },
    { icon: FileQuestion, label: 'Ngân hàng câu hỏi', path: '/admin/assessment' },
    { icon: BookMarked, label: 'Khung năng lực', path: '/admin/competency' },
    { icon: Bot, label: 'Trợ lý Mentor AI', path: '/admin/mentor-ai' },
    { icon: Users, label: 'Phân tích người học', path: '/admin/analytics' },
  ];

  const handleLogout = () => {
      navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20 transition-all duration-300">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold mr-0 lg:mr-3">
            V
          </div>
          <span className="hidden lg:block font-bold text-lg tracking-wider">VTC CMS</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-center lg:justify-start p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-orange-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="hidden lg:block ml-3 font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center lg:justify-start p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
                <LogOut size={20} />
                <span className="hidden lg:block ml-3 text-sm">Thoát Admin</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-10 overflow-auto">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    {navItems.find(i => i.path === location.pathname)?.label || 'Quản trị hệ thống'}
                </h1>
                <p className="text-slate-500 text-sm mt-1">Quản lý hệ thống học tập thông minh</p>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => alert("Cài đặt hệ thống toàn cục (Global Settings) đang được phát triển.")}
                    className="p-2 bg-white rounded-full text-slate-500 hover:text-slate-800 shadow-sm border border-slate-200 transition-colors"
                    title="Cài đặt hệ thống"
                >
                    <Settings size={20} />
                </button>
                
                <div className="relative">
                    <button 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity outline-none"
                    >
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-slate-900">Admin User</div>
                            <div className="text-xs text-slate-500">Quản trị viên</div>
                        </div>
                        <img 
                            src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" 
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                            alt="Admin"
                        />
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                        <>
                            <div 
                                className="fixed inset-0 z-30" 
                                onClick={() => setShowUserMenu(false)}
                            ></div>
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-40 animate-in fade-in zoom-in duration-200 origin-top-right">
                                <div className="px-4 py-2 border-b border-slate-50 sm:hidden">
                                    <p className="text-sm font-bold text-slate-900">Admin User</p>
                                    <p className="text-xs text-slate-500">Quản trị viên</p>
                                </div>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                    <UserCog size={16} className="text-slate-400" /> Hồ sơ cá nhân
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                    <Settings size={16} className="text-slate-400" /> Cấu hình hiển thị
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
                                >
                                    <LogOut size={16} /> Đăng xuất
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
