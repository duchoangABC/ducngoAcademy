
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronRight, AlertCircle, Clock, Brain, Target, ArrowRight, Zap } from 'lucide-react';
import { CMSService } from '../services/cmsService';
import { Question, GapAnalysis } from '../types';
import { useUser } from '../context/UserContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

const EntryTestScreen: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [gaps, setGaps] = useState<GapAnalysis[]>([]);

  useEffect(() => {
    const initTest = async () => {
        const q = await CMSService.generateEntryTest();
        setQuestions(q);
        setLoading(false);
    };
    initTest();
  }, []);

  const handleAnswer = (val: string) => {
      setAnswers(prev => ({ ...prev, [questions[currentIdx].id]: val }));
  };

  const handleNext = () => {
      if (currentIdx < questions.length - 1) {
          setCurrentIdx(prev => prev + 1);
      } else {
          handleSubmit();
      }
  };

  const handleSubmit = async () => {
      setSubmitting(true);
      // Mock scoring: just count answers for demo
      const score = Object.keys(answers).length; 
      const gapResults = await CMSService.submitEntryTest(score);
      
      updateUser({ hasTakenEntryTest: true });
      setGaps(gapResults);
      setCompleted(true);
      setSubmitting(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  if (completed) {
      const chartData = gaps.map(g => ({
          subject: g.subject,
          current: g.currentScore,
          target: g.targetScore,
          fullMark: 100
      }));

      return (
          <div className="min-h-screen bg-slate-50 flex flex-col">
              {/* Header Analysis */}
              <div className="bg-white p-6 pb-0 rounded-b-[30px] shadow-sm z-10">
                  <div className="flex flex-col items-center mb-4">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3 animate-in zoom-in duration-500">
                          <CheckCircle size={28} className="text-green-600" />
                      </div>
                      <h1 className="text-xl font-bold text-slate-900 text-center">Chẩn đoán năng lực hoàn tất!</h1>
                      <p className="text-xs text-slate-500 text-center max-w-xs">Hệ thống đã xây dựng bản đồ năng lực và xác định khoảng cách kiến thức (Knowledge Gap) của bạn.</p>
                  </div>

                  {/* Radar Chart Gap Visualization */}
                  <div className="h-[240px] w-full -mt-2 relative">
                      <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar
                                  name="Mục tiêu (Target)"
                                  dataKey="target"
                                  stroke="#3b82f6"
                                  strokeWidth={2}
                                  fill="#3b82f6"
                                  fillOpacity={0.1}
                              />
                              <Radar
                                  name="Hiện tại (Current)"
                                  dataKey="current"
                                  stroke="#ea580c"
                                  strokeWidth={2}
                                  fill="#ea580c"
                                  fillOpacity={0.5}
                              />
                              <Legend wrapperStyle={{ fontSize: '11px', marginTop: '-5px' }} />
                          </RadarChart>
                      </ResponsiveContainer>
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <div className="w-2 h-2 rounded-full bg-blue-500 opacity-50"></div> Kỳ vọng
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <div className="w-2 h-2 rounded-full bg-orange-500 opacity-80"></div> Thực tế
                          </div>
                      </div>
                  </div>
              </div>

              {/* Gap Analysis Details */}
              <div className="p-5 space-y-5 flex-1 overflow-y-auto">
                  <div>
                      <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider mb-3">
                          <Target size={18} className="text-red-500" />
                          Phân tích lỗ hổng (Key Gaps)
                      </h3>
                      
                      <div className="space-y-3">
                          {gaps.map((gap, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold text-slate-800 text-sm">{gap.subject}</span>
                                      <span className="text-[10px] font-extrabold bg-red-50 text-red-600 px-2 py-1 rounded-lg border border-red-100">
                                          Gap: -{gap.gap}%
                                      </span>
                                  </div>
                                  
                                  {/* Progress Bar Comparison */}
                                  <div className="relative h-2.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
                                      {/* Target Marker (Background bar) */}
                                      <div 
                                        className="absolute top-0 left-0 h-full bg-blue-100" 
                                        style={{ width: `${gap.targetScore}%` }}
                                      ></div>
                                      {/* Current Marker (Foreground bar) */}
                                      <div 
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" 
                                        style={{ width: `${gap.currentScore}%` }}
                                      ></div>
                                      
                                      {/* Gap Indicator Line (Optional visual cue) */}
                                      <div 
                                        className="absolute top-0 h-full w-0.5 bg-blue-500 z-10" 
                                        style={{ left: `${gap.targetScore}%` }}
                                      ></div>
                                  </div>
                                  
                                  <div className="flex justify-between text-[10px] text-slate-400 mb-3 font-medium">
                                      <span className="text-orange-600">Hiện tại: {gap.currentScore}/100</span>
                                      <span className="text-blue-600">Mục tiêu: {gap.targetScore}/100</span>
                                  </div>

                                  {/* AI Recommendation */}
                                  <div className="flex items-start gap-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                                      <Zap size={14} className="text-indigo-600 mt-0.5 shrink-0 fill-current"/>
                                      <div>
                                          <p className="text-[10px] text-indigo-400 font-bold uppercase mb-0.5">Đề xuất cải thiện</p>
                                          <p className="text-xs text-indigo-900 leading-relaxed font-medium">{gap.recommendation}</p>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-white border-t border-slate-100 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <button
                      onClick={() => navigate('/home')}
                      className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                      Xác nhận lộ trình học tập cá nhân <ArrowRight size={18}/>
                  </button>
              </div>
          </div>
      );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="min-h-screen bg-white flex flex-col">
        <header className="p-4 flex items-center border-b border-slate-100 sticky top-0 bg-white z-10">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                <ArrowLeft size={24} />
            </button>
            <div className="flex-1 mx-4">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>
            <div className="text-xs font-bold text-slate-500 min-w-[30px] text-right">
                {currentIdx + 1}/{questions.length}
            </div>
        </header>

        <main className="flex-1 p-6 flex flex-col max-w-lg mx-auto w-full">
            <div className="flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    currentQ.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-100' :
                    currentQ.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                    'bg-red-50 text-red-700 border-red-100'
                }`}>
                    {currentQ.difficulty}
                </span>
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                    <Clock size={12}/> 2:00
                </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-3">
                {currentQ.text}
            </h2>

            <div className="space-y-3 flex-1 animate-in fade-in slide-in-from-bottom-4">
                {['Phương án A: Giải thích hợp lý', 'Phương án B: Chưa chính xác', 'Phương án C: Cần bổ sung', 'Phương án D: Sai hoàn toàn'].map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(opt)}
                        className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-medium transition-all duration-200 active:scale-[0.99] ${
                            answers[currentQ.id] === opt 
                            ? 'border-primary bg-orange-50 text-primary shadow-sm' 
                            : 'border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                answers[currentQ.id] === opt ? 'border-primary' : 'border-slate-300'
                            }`}>
                                {answers[currentQ.id] === opt && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                            </div>
                            {opt}
                        </div>
                    </button>
                ))}
                {currentQ.type === 'Essay' && (
                    <textarea 
                        className="w-full p-4 border-2 border-slate-200 rounded-2xl min-h-[150px] focus:border-primary outline-none text-sm text-slate-700 placeholder-slate-400 transition-colors"
                        placeholder="Nhập câu trả lời của bạn..."
                        onChange={(e) => handleAnswer(e.target.value)}
                    />
                )}
            </div>

            <div className="mt-8 sticky bottom-6">
                <button 
                    onClick={handleNext}
                    disabled={!answers[currentQ.id]}
                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-orange-200 disabled:opacity-50 disabled:shadow-none hover:bg-orange-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    {submitting ? 'Đang phân tích...' : currentIdx === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
                    {!submitting && <ChevronRight size={20} />}
                </button>
            </div>
        </main>
    </div>
  );
};

export default EntryTestScreen;
