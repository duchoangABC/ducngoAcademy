import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';
import { ShieldCheck } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { startTutorial } = useOnboarding();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const hasCompleted = localStorage.getItem('has_completed_onboarding');
    
    if (!hasCompleted) {
       startTutorial();
    } else {
       navigate('/home');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white items-center justify-center p-6 relative">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-lg transform rotate-3">
             <span className="text-white text-4xl font-extrabold tracking-wider">VTC</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Đăng nhập</h1>
          <p className="text-gray-500 mt-2">Chào mừng quay trở lại!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              defaultValue="binh@vtc.vn"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              defaultValue="password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-full text-lg shadow-lg hover:bg-orange-700 transition-colors mt-4"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
            <button 
              type="button" 
              onClick={() => { localStorage.removeItem('has_completed_onboarding'); handleLogin({ preventDefault: () => {} } as any); }}
              className="text-xs text-gray-400 hover:text-primary"
            >
              Reset Tutorial
            </button>
            
            <div className="border-t border-gray-100 pt-4">
                <button 
                    onClick={() => navigate('/admin')}
                    className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors"
                >
                    <ShieldCheck size={16} />
                    Truy cập CMS Admin (Demo)
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;