import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, User, Bookmark } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navItems = [
    { icon: Home, label: 'Trang chủ', path: '/home' },
    { icon: Compass, label: 'Lộ trình', path: '/courses' },
    { icon: User, label: 'Cá nhân', path: '/profile' },
    { icon: Bookmark, label: 'Đã lưu', path: '/saved' },
  ];

  if (location.pathname === '/') return null;
  if (location.pathname === '/chat') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 z-50 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center w-16 py-1"
            >
              <item.icon size={24} className={active ? 'text-primary' : 'text-gray-400'} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] mt-1 font-medium ${active ? 'text-primary' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;