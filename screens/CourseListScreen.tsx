
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Star, ChevronDown, Clock, PlayCircle, CheckCircle, Play, Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';

const lessons = [
  { id: 1, title: 'Tổng quan về trí tuệ nhân tạo', completed: true, videoCount: 6, duration: '45 phút' },
  { id: 2, title: 'Giao tiếp và hợp tác trong môi trường số', completed: false, videoCount: 4, duration: '30 phút' },
  { id: 3, title: 'Sáng tạo nội dung số', completed: false, videoCount: 5, duration: '40 phút' },
  { id: 4, title: 'An toàn và liêm chính học thuật', completed: false, videoCount: 3, duration: '25 phút' },
  { id: 5, title: 'Kỹ năng số trong công nghiệp Văn Hóa', completed: false, videoCount: 5, duration: '35 phút' },
  { id: 6, title: 'Kỹ năng số trong hoạt động Du lịch', completed: false, videoCount: 4, duration: '30 phút' },
];

const CourseListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'current' | 'all'>('all');
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);

  const currentLessonIndex = lessons.findIndex(l => !l.completed);
  const displayedLessons = activeTab === 'current' 
    ? (currentLessonIndex !== -1 ? [lessons[currentLessonIndex]] : []) 
    : lessons;

  // Calculate progress
  const totalVideos = lessons.reduce((acc, curr) => acc + (curr.videoCount || 0), 0);
  const completedVideos = lessons.filter(l => l.completed).reduce((acc, curr) => acc + (curr.videoCount || 0), 0);
  const progressPercentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
            <button onClick={() => navigate('/home')} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Lộ trình học tập</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                <Flame className="text-orange-500" size={18} fill="currentColor" />
                <span className="font-bold text-sm">{user.streak}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                <Star className="text-yellow-400" size={18} fill="currentColor" />
                <span className="font-bold text-sm">{user.points}</span>
            </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Program Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative">
            <div className="flex justify-between items-start mb-3">
                <div className="pr-2 flex-1">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider mb-1 block">Chương trình chính quy</span>
                    <h2 className="font-bold text-gray-900 text-lg leading-tight">Công nghệ số và Ứng dụng AI</h2>
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setShowProgramDropdown(!showProgramDropdown)}
                        className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors"
                    >
                        <span>Thay đổi</span>
                        <ChevronDown size={14} />
                    </button>
                    {showProgramDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500">Chương trình khác</div>
                            <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-gray-700">Kỹ năng bán hàng 4.0</button>
                            <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-gray-700">Leadership & Management</button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        <img className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt=""/>
                        <img className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt=""/>
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">+2K</div>
                    </div>
                    <span>Học viên</span>
                </div>
                <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-md">
                    <Clock size={12} />
                    <span className="font-medium">Còn 29 ngày</span>
                </div>
            </div>
        </div>

        {/* Filters */}
        <div id="course-list">
            <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
                <button 
                    onClick={() => setActiveTab('current')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                        activeTab === 'current' 
                        ? 'bg-white text-primary shadow' 
                        : 'text-gray-500 hover:text-gray-700 shadow-none bg-transparent'
                    }`}
                >
                    Gợi ý hiện tại
                </button>
                <button 
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                        activeTab === 'all' 
                        ? 'bg-white text-primary shadow' 
                        : 'text-gray-500 hover:text-gray-700 shadow-none bg-transparent'
                    }`}
                >
                    Toàn bộ lộ trình
                </button>
            </div>
            
            {/* Progress Bar Header */}
            {activeTab === 'all' && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tiến độ tổng quan</span>
                            <div className="text-2xl font-bold text-gray-900 mt-0.5">{progressPercentage}%</div>
                        </div>
                        <div className="text-right">
                             <div className="text-xs text-gray-500 mb-1">Đã hoàn thành</div>
                             <span className="font-bold text-gray-900">{completedVideos}</span>
                             <span className="text-gray-400 text-xs"> / {totalVideos} Videos</span>
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-1000 ease-out relative" 
                            style={{ width: `${progressPercentage}%` }}
                        >
                             <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Display */}
            <div className="space-y-4">
                {activeTab === 'current' ? (
                    // CURRENT TAB VIEW
                    displayedLessons.length > 0 ? (
                        <div className="animate-in fade-in zoom-in duration-300">
                             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Bài học tiếp theo</h3>
                             {displayedLessons.map((lesson) => (
                                <div 
                                    key={lesson.id} 
                                    onClick={() => navigate(`/lesson/${lesson.id}`)}
                                    className="bg-white p-5 rounded-2xl shadow-lg shadow-blue-50 border border-blue-100 cursor-pointer hover:border-blue-300 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <PlayCircle size={80} className="text-primary" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold mb-3">
                                            <span className="relative flex h-2 w-2">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                            </span>
                                            ĐANG HỌC
                                        </div>
                                        <h4 className="font-bold text-lg text-gray-900 mb-2">{lesson.title}</h4>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <PlayCircle size={16} className="text-orange-500" />
                                                <span>{lesson.videoCount} Videos</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={16} className="text-gray-400" />
                                                <span>~ {lesson.duration}</span>
                                            </div>
                                        </div>
                                        <button className="mt-4 w-full py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                                            <Play size={18} fill="currentColor" />
                                            Học ngay
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <h3 className="font-bold text-gray-900">Tuyệt vời!</h3>
                            <p className="text-gray-500 text-sm">Bạn đã hoàn thành tất cả bài học hiện tại.</p>
                        </div>
                    )
                ) : (
                    // ALL TAB VIEW (LIST)
                    displayedLessons.map((lesson, index) => {
                        // Simple locking logic for demo: unlock if previous is completed. Lesson 1 always unlocked.
                        const isLocked = !lesson.completed && lesson.id !== (currentLessonIndex !== -1 ? lessons[currentLessonIndex].id : -1) && index > 0 && !lessons[index-1].completed;
                        
                        return (
                            <div 
                                key={lesson.id}
                                onClick={() => !isLocked && navigate(`/lesson/${lesson.id}`)}
                                className={`bg-white p-4 rounded-xl border flex items-center justify-between transition-all ${
                                    isLocked 
                                        ? 'border-gray-100 opacity-60 bg-gray-50 cursor-not-allowed' 
                                        : 'border-gray-100 hover:border-blue-200 cursor-pointer shadow-sm'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                        lesson.completed 
                                            ? 'bg-green-100 text-green-600' 
                                            : isLocked 
                                                ? 'bg-gray-100 text-gray-400' 
                                                : 'bg-blue-50 text-blue-600'
                                    }`}>
                                        {lesson.completed ? <CheckCircle size={20} /> : isLocked ? <Lock size={20} /> : <Play size={20} fill="currentColor" />}
                                    </div>
                                    <div>
                                        <h4 className={`font-semibold text-sm mb-1 ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>{lesson.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><PlayCircle size={12}/> {lesson.videoCount} Videos</span>
                                            {/* <span className="w-1 h-1 rounded-full bg-gray-300"></span> */}
                                            {/* <span>{lesson.duration}</span> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    {!isLocked && !lesson.completed && (
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default CourseListScreen;
