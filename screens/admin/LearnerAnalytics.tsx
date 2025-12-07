
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, MoreVertical, Target, CheckCircle, AlertTriangle, Loader, ChevronDown, Check, Brain, TrendingUp, Zap, ArrowRight, Lightbulb } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { CMSService } from '../../services/cmsService';
import { LearnerProfile } from '../../types';

const LearnerAnalytics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<LearnerProfile[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await CMSService.getLearners();
    setStudents(data);
    if (data.length > 0 && selectedStudentId === null) {
        setSelectedStudentId(data[0].id);
    }
    setLoading(false);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'All' || s.adaptiveScore === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [students, searchTerm, filterType]);

  const selectedStudent = useMemo(() => 
    students.find(s => s.id === selectedStudentId) || students[0]
  , [students, selectedStudentId]);

  const handleAssignModule = async () => {
    if (!selectedStudent) return;
    
    // Optimistic update
    const updatedStudent = { ...selectedStudent, isAssigned: true };
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    
    // API Call
    await CMSService.updateLearner(updatedStudent);
    alert(`Đã gán module bổ trợ cho học viên ${selectedStudent.name} thành công!`);
  };

  const handleExport = () => {
    // Generate CSV content
    const headers = ["ID", "Name", "Email", "Course", "Progress", "AvgScore", "AdaptiveScore", "Assigned"];
    const rows = students.map(s => [
        s.id, s.name, s.email, s.course, s.progress, s.avgScore, s.adaptiveScore, s.isAssigned ? "Yes" : "No"
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "learner_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Loader className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
       {/* Toolbar */}
       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm học viên (Tên, ID, Email)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:bg-white"
                />
            </div>
            <div className="flex gap-2 w-full sm:w-auto relative">
                <div className="relative">
                    <button 
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className={`px-3 py-2 bg-white border text-slate-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors ${filterType !== 'All' ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200'}`}
                    >
                        <Filter size={16}/> 
                        {filterType === 'All' ? 'Filter Score' : `Score: ${filterType}`}
                        <ChevronDown size={14} />
                    </button>
                    {showFilterDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                            {['All', 'High', 'Medium', 'Low'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => { setFilterType(type as any); setShowFilterDropdown(false); }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex justify-between items-center"
                                >
                                    <span>{type === 'All' ? 'Tất cả' : type}</span>
                                    {filterType === type && <Check size={14} className="text-primary"/>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={handleExport}
                    className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                    <Download size={16}/> Export CSV
                </button>
            </div>
       </div>

       {/* Main Layout */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student List */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm min-h-[500px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4">Học viên</th>
                                    <th className="px-6 py-4">Tiến độ</th>
                                    <th className="px-6 py-4">Điểm TB</th>
                                    <th className="px-6 py-4">Adaptive Score</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr 
                                            key={student.id} 
                                            onClick={() => setSelectedStudentId(student.id)}
                                            className={`transition-colors cursor-pointer ${selectedStudentId === student.id ? 'bg-blue-50/60 border-l-4 border-l-primary' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                                                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover"/>
                                                </div>
                                                <div>
                                                    <div>{student.name}</div>
                                                    <div className="text-xs text-slate-400 font-normal">{student.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-slate-100 rounded-full h-1.5">
                                                        <div className={`h-1.5 rounded-full ${student.progress > 80 ? 'bg-green-500' : student.progress > 50 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{width: `${student.progress}%`}}></div>
                                                    </div>
                                                    <span className="text-xs text-slate-500">{student.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-700">{student.avgScore}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    student.adaptiveScore === 'High' ? 'bg-green-100 text-green-700' : 
                                                    student.adaptiveScore === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {student.adaptiveScore}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200 transition-colors"><MoreVertical size={16}/></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Không tìm thấy học viên nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Scientific Analysis Panel (Updated) */}
            {selectedStudent && (
                <div className="bg-white rounded-2xl border border-slate-200 p-0 flex flex-col h-full shadow-sm sticky top-6 animate-in slide-in-from-right-4 duration-300 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 pb-0">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <Brain className="text-primary" size={20}/>
                                Chẩn đoán năng lực
                            </h3>
                            <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">
                                AI Generated
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <img src={selectedStudent.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover" />
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 leading-tight">{selectedStudent.name}</h2>
                                <p className="text-xs text-slate-500">{selectedStudent.course}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                        selectedStudent.analysis.learningVelocity === 'Fast' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {selectedStudent.analysis.learningVelocity} Learner
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-600">
                                        Style: {selectedStudent.analysis.cognitiveStyle}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                        {/* Radar Chart Compact */}
                        <div className="h-48 relative -mx-4">
                            <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={selectedStudent.radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{fontSize: 9, fill: '#64748b'}} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar 
                                    name={selectedStudent.name} 
                                    dataKey="A" 
                                    stroke="#EA580C" 
                                    strokeWidth={2} 
                                    fill="#EA580C" 
                                    fillOpacity={0.2} 
                                />
                            </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Scientific Insights */}
                        <div className="space-y-4">
                            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb size={16} className="text-indigo-600"/>
                                    <h4 className="font-bold text-indigo-900 text-xs uppercase tracking-wider">Nhận diện cốt lõi (Key Insight)</h4>
                                </div>
                                <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                                    {selectedStudent.analysis.keyInsight}
                                </p>
                            </div>

                            <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle size={16} className="text-red-600"/>
                                    <h4 className="font-bold text-red-900 text-xs uppercase tracking-wider">Phân tích lỗ hổng (Gap Analysis)</h4>
                                </div>
                                <p className="text-xs text-red-800 leading-relaxed">
                                    {selectedStudent.analysis.gapAnalysis}
                                </p>
                            </div>
                        </div>

                        {/* Action Plan */}
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                <Target size={16} className="text-slate-600"/>
                                Chiến lược can thiệp
                            </h4>
                            <div className="relative border-l-2 border-slate-200 ml-2 space-y-6">
                                <div className="pl-6 relative">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm"></div>
                                    <h5 className="text-xs font-bold text-orange-600 uppercase mb-1">Hành động ngay (Immediate)</h5>
                                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        {selectedStudent.analysis.actionPlan.immediate}
                                    </p>
                                </div>
                                <div className="pl-6 relative">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                                    <h5 className="text-xs font-bold text-blue-600 uppercase mb-1">Dài hạn (Long-term)</h5>
                                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        {selectedStudent.analysis.actionPlan.longTerm}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Assign Button */}
                        <div className="pt-2">
                            {selectedStudent.isAssigned ? (
                                <button disabled className="w-full py-3 bg-green-50 text-green-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-default border border-green-200">
                                    <CheckCircle size={16} />
                                    Đã kích hoạt lộ trình bổ trợ
                                </button>
                            ) : (
                                <button 
                                    onClick={handleAssignModule}
                                    className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Zap size={16} className="text-yellow-400" fill="currentColor"/>
                                    Kích hoạt Can thiệp & Gán Module
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
       </div>
    </div>
  );
};

export default LearnerAnalytics;
