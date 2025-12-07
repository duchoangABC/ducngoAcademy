
import React, { useEffect, useState } from 'react';
import { FileQuestion, Shuffle, Layers, Tag, Plus, MoreHorizontal, Loader, Trash2, X, Check, Save, Edit2, Search } from 'lucide-react';
import { CMSService } from '../../services/cmsService';
import { Question } from '../../types';

const AssessmentEngine: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    text: '',
    type: 'MCQ' as const,
    difficulty: 'Medium' as const,
    tags: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await CMSService.getQuestions();
    setQuestions(data);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ text: '', type: 'MCQ', difficulty: 'Medium', tags: '' });
    setShowAddModal(true);
  };

  const openEditModal = (q: Question) => {
    setEditingId(q.id);
    setFormData({
        text: q.text,
        type: q.type as any,
        difficulty: q.difficulty as any,
        tags: q.tags.join(', ')
    });
    setShowAddModal(true);
  };

  const handleSaveQuestion = async () => {
    if (!formData.text) return;

    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    
    if (editingId) {
        // Update existing
        await CMSService.updateQuestion({
            id: editingId,
            text: formData.text,
            type: formData.type,
            difficulty: formData.difficulty,
            tags: tagsArray.length > 0 ? tagsArray : ['General']
        });
    } else {
        // Create new
        await CMSService.addQuestion({
            text: formData.text,
            type: formData.type,
            difficulty: formData.difficulty,
            tags: tagsArray.length > 0 ? tagsArray : ['General']
        });
    }

    setShowAddModal(false);
    loadData();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
        await CMSService.deleteQuestion(id);
        loadData();
    }
  };

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    const result = await CMSService.generateTestPreview({ total: 5, distribution: { easy: 30, medium: 50, hard: 20 } });
    setGeneratedQuestions(result);
    setIsGenerating(false);
    setShowPreviewModal(true);
  };

  // Filter Logic: Tag + Search Term
  const filteredQuestions = questions.filter(q => {
    const matchesTag = selectedTag === 'Tất cả' || q.tags.includes(selectedTag);
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const uniqueTags = ['Tất cả', ...Array.from(new Set(questions.flatMap(q => q.tags)))];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Question Bank Manager */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 h-[600px] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Layers size={20} className="text-primary" />
                    Ngân hàng câu hỏi (Question Bank)
                </h2>
                <button 
                    onClick={openAddModal}
                    className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-2 transition-colors"
                >
                    <Plus size={16}/> Thêm mới
                </button>
            </div>
            
            {/* Filter & Search Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col gap-3">
                 {/* Search Input */}
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm nội dung câu hỏi..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                 </div>

                 {/* Tags */}
                 <div className="flex gap-2 overflow-x-auto shrink-0 scrollbar-hide pb-1">
                    {uniqueTags.slice(0, 8).map((tag, i) => (
                        <button 
                            key={i} 
                            onClick={() => setSelectedTag(tag)}
                            className={`px-3 py-1 text-xs font-bold rounded-full border transition-all whitespace-nowrap ${
                                selectedTag === tag 
                                ? 'bg-slate-800 text-white border-slate-800' 
                                : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader className="animate-spin text-slate-400" />
                    </div>
                ) : filteredQuestions.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                        <FileQuestion size={48} className="text-slate-200 mb-2" />
                        <p>Không tìm thấy câu hỏi nào phù hợp.</p>
                    </div>
                ) : (
                    filteredQuestions.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between group">
                            <div className="flex-1 pr-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                        item.difficulty === 'Easy' ? 'bg-green-50 text-green-600 border-green-200' :
                                        item.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                        'bg-red-50 text-red-600 border-red-200'
                                    }`}>{item.difficulty}</span>
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{item.type}</span>
                                </div>
                                <h4 className="font-semibold text-slate-800 text-sm">{item.text}</h4>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {item.tags.map(t => (
                                        <span key={t} className="text-[10px] text-slate-400 flex items-center gap-0.5 bg-slate-50 px-1 rounded">
                                            <Tag size={10}/> {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openEditModal(item)}
                                    className="text-slate-400 hover:text-blue-500 p-2"
                                    title="Edit Question"
                                >
                                    <Edit2 size={18}/>
                                </button>
                                <button 
                                    onClick={(e) => handleDelete(item.id, e)}
                                    className="text-slate-400 hover:text-red-500 p-2"
                                    title="Delete Question"
                                >
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 text-center">
                Showing {filteredQuestions.length} of {questions.length} items
            </div>
        </div>

        {/* Dynamic Test Configuration */}
        <div className="w-full lg:w-96 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg sticky top-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Shuffle size={20} className="text-blue-400"/>
                    Cấu hình Dynamic Test
                </h3>
                <p className="text-xs text-slate-400 mb-6">Hệ thống sẽ tự động sinh đề dựa trên cấu hình dưới đây.</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Tổng số câu hỏi</label>
                        <input type="range" className="w-full mt-2 accent-blue-500 cursor-pointer" min="5" max="20" defaultValue="5" />
                        <div className="flex justify-between text-xs font-bold">
                            <span>5</span>
                            <span className="text-blue-400">Random Selection</span>
                            <span>20</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Phân bổ độ khó</label>
                        <div className="flex h-4 rounded-full overflow-hidden mt-2 border border-slate-700">
                            <div className="bg-green-500 w-[30%]" title="Easy"></div>
                            <div className="bg-yellow-500 w-[50%]" title="Medium"></div>
                            <div className="bg-red-500 w-[20%]" title="Hard"></div>
                        </div>
                        <div className="flex justify-between text-[10px] mt-1 text-slate-400">
                            <span className="text-green-400">30% Dễ</span>
                            <span className="text-yellow-400">50% Vừa</span>
                            <span className="text-red-400">20% Khó</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                         <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-offset-slate-900 cursor-pointer" defaultChecked />
                            <span className="text-sm font-bold group-hover:text-blue-300 transition-colors">Adaptive Mode</span>
                         </label>
                         <p className="text-[10px] text-slate-400 mt-2 pl-8">
                            Độ khó câu sau sẽ thay đổi dựa trên kết quả câu trước.
                         </p>
                    </div>

                    <button 
                        onClick={handleGeneratePreview}
                        disabled={isGenerating}
                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl mt-4 hover:bg-blue-50 transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                    >
                        {isGenerating && <Loader size={16} className="animate-spin" />}
                        {isGenerating ? 'Generating...' : 'Generate Test Preview'}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Add/Edit Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">{editingId ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nội dung câu hỏi</label>
                        <textarea 
                            value={formData.text}
                            onChange={(e) => setFormData({...formData, text: e.target.value})}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px]"
                            placeholder="Nhập nội dung câu hỏi..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Loại câu hỏi</label>
                            <select 
                                value={formData.type}
                                // @ts-ignore
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                            >
                                <option value="MCQ">Trắc nghiệm (MCQ)</option>
                                <option value="Essay">Tự luận (Essay)</option>
                                <option value="Code">Code</option>
                                <option value="TrueFalse">Đúng/Sai</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Độ khó</label>
                            <select 
                                value={formData.difficulty}
                                // @ts-ignore
                                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                                className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                            >
                                <option value="Easy">Dễ (Easy)</option>
                                <option value="Medium">Trung bình (Medium)</option>
                                <option value="Hard">Khó (Hard)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tags (phân cách bởi dấu phẩy)</label>
                        <input 
                            type="text" 
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            placeholder="Ví dụ: AI, Python, Basics"
                        />
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg">Hủy</button>
                    <button onClick={handleSaveQuestion} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-orange-700 shadow-lg shadow-orange-200 flex items-center gap-2">
                        <Save size={16} /> {editingId ? 'Cập nhật' : 'Lưu câu hỏi'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Preview Test Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800">Preview Đề thi (AI Generated)</h3>
                        <p className="text-xs text-slate-500">Đã chọn {generatedQuestions.length} câu hỏi phù hợp với cấu hình.</p>
                    </div>
                    <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                    {generatedQuestions.map((q, idx) => (
                        <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-slate-400">Câu {idx + 1}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                        q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                        q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                }`}>{q.difficulty}</span>
                            </div>
                            <p className="font-semibold text-slate-800">{q.text}</p>
                            <div className="mt-2 pt-2 border-t border-slate-100 flex gap-2">
                                {q.tags.map(t => <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{t}</span>)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
                    <button onClick={() => setShowPreviewModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Đóng Preview</button>
                    <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2">
                        <Check size={16} /> Xuất bản đề thi
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentEngine;
