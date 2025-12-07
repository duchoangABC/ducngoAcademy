
import React, { useEffect, useState } from 'react';
import { Users, BookOpen, BrainCircuit, Activity, TrendingUp, AlertCircle, Loader } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CMSService } from '../../services/cmsService';
import { DashboardStats } from '../../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        const data = await CMSService.getStats();
        setStats(data);
        setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader className="animate-spin text-primary" size={32} /></div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            icon={Users} 
            label="Học viên Active" 
            value={stats.activeUsers.toLocaleString()} 
            trend="+12%" 
            color="bg-blue-500" 
        />
        <StatCard 
            icon={BookOpen} 
            label="Khóa học hoàn thành" 
            value={stats.completions.toLocaleString()} 
            trend="+5%" 
            color="bg-green-500" 
        />
        <StatCard 
            icon={BrainCircuit} 
            label="Adaptive Triggered" 
            value={stats.adaptiveTriggers.toLocaleString()} 
            trend="+25%" 
            color="bg-purple-500" 
            subtext="Lộ trình được cá nhân hóa"
        />
        <StatCard 
            icon={Activity} 
            label="Avg. Engagement" 
            value={stats.engagement} 
            trend="-2%" 
            color="bg-orange-500" 
            isNegative
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Hiệu suất học tập & Thích ứng (LXP)
            </h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.chartData}>
                        <defs>
                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EA580C" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                        <Area type="monotone" dataKey="active" stroke="#EA580C" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                        <Area type="monotone" dataKey="completion" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCompletion)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* AI Recommendations / Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-500" />
                Cần can thiệp (AI Detected)
            </h3>
            <div className="space-y-4">
                {[
                    { name: 'Nguyễn Văn A', issue: 'Điểm drop < 40% môn AI', action: 'Gợi ý bài bổ trợ' },
                    { name: 'Trần Thị B', issue: 'Không active 5 ngày', action: 'Gửi noti nhắc nhở' },
                    { name: 'Lê C', issue: 'Kẹt tại Module 3', action: 'Mở khóa hint' },
                ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-700">{item.name}</span>
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">High Risk</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{item.issue}</p>
                        <button className="mt-2 w-full py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors">
                            {item.action}
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<any> = ({ icon: Icon, label, value, trend, color, subtext, isNegative }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${isNegative ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {trend}
            </span>
        </div>
        <div>
            <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
    </div>
);

export default AdminDashboard;
