
import React, { useState, useEffect, useRef } from 'react';
import { BookMarked, Plus, Edit2, Trash2, ChevronDown, ChevronRight, Save, X, Target, Loader, Download, Upload, FileSpreadsheet, Layers } from 'lucide-react';
import { CMSService } from '../../services/cmsService';
import { CompetencyFramework, CompetencySubject } from '../../types';

const CompetencyManager: React.FC = () => {
  const [frameworks, setFrameworks] = useState<CompetencyFramework[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingFramework, setEditingFramework] = useState<CompetencyFramework | null>(null);
  const [formData, setFormData] = useState<{
      name: string;
      type: 'Entry' | 'Target';
      subjects: CompetencySubject[];
  }>({
      name: '',
      type: 'Target',
      subjects: []
  });

  // Import State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await CMSService.getFrameworks();
    setFrameworks(data);
    setLoading(false);
  };

  const handleOpenModal = (fw?: CompetencyFramework) => {
      if (fw) {
          setEditingFramework(fw);
          setFormData({
              name: fw.name,
              type: fw.type,
              subjects: fw.subjects
          });
      } else {
          setEditingFramework(null);
          setFormData({
              name: '',
              type: 'Target',
              subjects: []
          });
      }
      setShowModal(true);
  };

  const handleSave = async () => {
      if (!formData.name) return;
      
      const newFramework: CompetencyFramework = {
          id: editingFramework ? editingFramework.id : Date.now().toString(),
          name: formData.name,
          type: formData.type,
          subjects: formData.subjects
      };

      await CMSService.saveFramework(newFramework);
      setShowModal(false);
      loadData();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm('Bạn có chắc muốn xóa khung năng lực này?')) {
          await CMSService.deleteFramework(id);
          loadData();
      }
  };

  const addSubject = () => {
      const newSubject: CompetencySubject = {
          id: Date.now().toString(),
          name: 'Năng lực mới',
          description: '',
          levels: [1, 2, 3, 4, 5].map(l => ({ level: l, name: `Cấp độ ${l}`, description: '' }))
      };
      setFormData({ ...formData, subjects: [...formData.subjects, newSubject] });
  };

  const updateSubject = (idx: number, field: string, value: string) => {
      const updated = [...formData.subjects];
      updated[idx] = { ...updated[idx], [field]: value };
      setFormData({ ...formData, subjects: updated });
  };

  const updateLevel = (subjectIdx: number, levelIdx: number, field: string, value: string) => {
      const updatedSubjects = [...formData.subjects];
      const updatedLevels = [...updatedSubjects[subjectIdx].levels];
      updatedLevels[levelIdx] = { ...updatedLevels[levelIdx], [field]: value };
      updatedSubjects[subjectIdx].levels = updatedLevels;
      setFormData({ ...formData, subjects: updatedSubjects });
  };

  const removeSubject = (idx: number) => {
      const updated = [...formData.subjects];
      updated.splice(idx, 1);
      setFormData({ ...formData, subjects: updated });
  };

  // --- Import/Export Handlers ---
  const handleDownloadTemplate = () => {
      const csvContent = "data:text/csv;charset=utf-8,Subject Name,Description,Level 1,Level 2,Level 3,Level 4,Level 5\nExample Subject,Subject Description,Basic,Intermediate,Advanced,Expert,Master";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "mau_khung_nang_luc.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setSelectedFile(e.target.files[0]);
      }
  };

  const handleImport = async () => {
      if (!selectedFile) {
          alert("Vui lòng chọn file để nhập!");
          return;
      }
      
      // Mock import logic
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      alert(`Đã nhập thành công khung năng lực từ file: ${selectedFile.name}`);
      setShowImportModal(false);
      setSelectedFile(null);
      setLoading(false);
      // In real app, would parse CSV and add to DB
  };

  const openImportModal = () => {
      setSelectedFile(null);
      setShowImportModal(true);
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col min-h-[600px]">
          {/* Header Toolbar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <BookMarked size={20} className="text-primary" />
                    <div>
                        <h2 className="font-bold text-slate-800">Quản trị Khung năng lực</h2>
                        <p className="text-xs text-slate-500 hidden sm:block">Định nghĩa tiêu chuẩn đầu ra và tiêu chí đầu vào</p>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={handleDownloadTemplate}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2"
                    >
                        <Download size={14}/> Tải mẫu
                    </button>
                    <button 
                        onClick={openImportModal}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2"
                    >
                        <Upload size={14}/> Nhập file
                    </button>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-orange-700 flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <Plus size={16}/> Thêm mới
                    </button>
                </div>
          </div>

          {/* List Content */}
          <div className="p-6 overflow-y-auto">
              {frameworks.length === 0 ? (
                  <div className="text-center text-slate-400 py-10 flex flex-col items-center">
                      <Target size={48} className="mb-2 opacity-20"/>
                      <p>Chưa có khung năng lực nào được thiết lập.</p>
                      <button onClick={openImportModal} className="text-primary font-bold mt-2 hover:underline">Nhập từ file mẫu</button>
                  </div>
              ) : (
                  <div className="space-y-4">
                      {frameworks.map(fw => (
                          <div key={fw.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
                              <div 
                                onClick={() => setExpandedId(expandedId === fw.id ? null : fw.id)}
                                className="p-4 flex items-center justify-between cursor-pointer bg-slate-50/50 hover:bg-slate-50"
                              >
                                  <div className="flex items-center gap-3">
                                      <button className="text-slate-400">
                                          {expandedId === fw.id ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                                      </button>
                                      <div>
                                          <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                              {fw.name}
                                              <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${fw.type === 'Target' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                                                  {fw.type === 'Target' ? 'Đầu ra' : 'Đầu vào'}
                                              </span>
                                          </div>
                                          <div className="text-xs text-slate-500 mt-1">{fw.subjects.length} Năng lực cốt lõi</div>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <button onClick={(e) => { e.stopPropagation(); handleOpenModal(fw); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                          <Edit2 size={18} />
                                      </button>
                                      <button onClick={(e) => handleDelete(fw.id, e)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                          <Trash2 size={18} />
                                      </button>
                                  </div>
                              </div>
                              
                              {expandedId === fw.id && (
                                  <div className="border-t border-slate-100 p-4 bg-white animate-in slide-in-from-top-2">
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                          {fw.subjects.map((subj, idx) => (
                                              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                                  <div className="flex items-center gap-2 mb-2">
                                                      <Target size={16} className="text-orange-500"/>
                                                      <h4 className="font-bold text-slate-800 text-sm">{subj.name}</h4>
                                                  </div>
                                                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{subj.description || 'Chưa có mô tả'}</p>
                                                  <div className="space-y-1">
                                                      {subj.levels.slice(0, 3).map(l => (
                                                          <div key={l.level} className="flex justify-between text-[10px] text-slate-600 border-b border-slate-100 pb-1 last:border-0">
                                                              <span className="font-bold">Lv {l.level}</span>
                                                              <span className="text-slate-400 truncate max-w-[120px]">{l.name}</span>
                                                          </div>
                                                      ))}
                                                      {subj.levels.length > 3 && <div className="text-[10px] text-slate-400 text-center pt-1">+ {subj.levels.length - 3} cấp độ khác</div>}
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-slate-800">{editingFramework ? 'Chỉnh sửa Khung năng lực' : 'Tạo Khung năng lực mới'}</h3>
                      <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {/* Framework Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Tên Khung năng lực</label>
                              <input 
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                  placeholder="VD: Kỹ sư AI Cấp độ 1"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Loại Khung</label>
                              <select 
                                  value={formData.type}
                                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                                  className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                              >
                                  <option value="Target">Target (Đầu ra kỳ vọng)</option>
                                  <option value="Entry">Entry (Đầu vào/Sàng lọc)</option>
                              </select>
                          </div>
                      </div>

                      {/* Subjects List */}
                      <div className="border-t border-slate-100 pt-6">
                          <div className="flex justify-between items-center mb-4">
                              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Danh sách năng lực thành phần</h4>
                              <button onClick={addSubject} className="text-xs font-bold text-primary hover:bg-orange-50 px-2 py-1 rounded transition-colors flex items-center gap-1">
                                  <Plus size={14} /> Thêm năng lực
                              </button>
                          </div>
                          
                          <div className="space-y-6">
                              {formData.subjects.map((subj, idx) => (
                                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group transition-all hover:shadow-md">
                                      <button 
                                        onClick={() => removeSubject(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-white text-slate-400 hover:text-red-500 rounded-lg shadow-sm"
                                        title="Xóa năng lực này"
                                      >
                                          <Trash2 size={14}/>
                                      </button>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Tên năng lực (Subject)</label>
                                              <input 
                                                  value={subj.name}
                                                  onChange={(e) => updateSubject(idx, 'name', e.target.value)}
                                                  className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:border-primary outline-none"
                                                  placeholder="VD: Kỹ năng giao tiếp"
                                              />
                                          </div>
                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Mô tả ngắn</label>
                                              <input 
                                                  value={subj.description}
                                                  onChange={(e) => updateSubject(idx, 'description', e.target.value)}
                                                  className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:border-primary outline-none"
                                                  placeholder="Mô tả phạm vi năng lực..."
                                              />
                                          </div>
                                      </div>

                                      {/* Level Definition Section */}
                                      <div className="bg-white p-3 rounded-lg border border-slate-100">
                                          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-600 uppercase">
                                              <Layers size={14} className="text-blue-500" />
                                              Định nghĩa 5 Cấp độ (Levels)
                                          </div>
                                          <div className="space-y-2">
                                              {subj.levels.map((lvl, lIdx) => (
                                                  <div key={lIdx} className="flex gap-2 items-center">
                                                      <div className="w-12 flex-shrink-0 text-[10px] font-bold text-slate-400 bg-slate-100 px-1 py-0.5 rounded text-center">
                                                          Cấp {lvl.level}
                                                      </div>
                                                      <input 
                                                          className="w-1/3 p-1.5 text-xs border border-slate-200 rounded focus:border-blue-400 outline-none"
                                                          placeholder="Tên (VD: Cơ bản)"
                                                          value={lvl.name}
                                                          onChange={(e) => updateLevel(idx, lIdx, 'name', e.target.value)}
                                                      />
                                                      <input 
                                                          className="flex-1 p-1.5 text-xs border border-slate-200 rounded focus:border-blue-400 outline-none"
                                                          placeholder="Mô tả tiêu chuẩn đạt được..."
                                                          value={lvl.description}
                                                          onChange={(e) => updateLevel(idx, lIdx, 'description', e.target.value)}
                                                      />
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                      <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg">Hủy</button>
                      <button onClick={handleSave} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-orange-700 shadow-lg shadow-orange-200 flex items-center gap-2">
                          <Save size={16} /> Lưu khung năng lực
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg text-slate-800">Nhập Khung năng lực</h3>
                      <button onClick={() => setShowImportModal(false)}><X size={20} className="text-slate-400"/></button>
                  </div>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 ${selectedFile ? 'border-green-300 bg-green-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                  >
                      <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={handleFileChange}
                          accept=".csv,.xlsx"
                      />
                      {selectedFile ? (
                          <>
                              <FileSpreadsheet size={48} className="text-green-500 mb-3" />
                              <span className="text-sm font-bold text-green-700">{selectedFile.name}</span>
                              <span className="text-xs text-green-600 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                          </>
                      ) : (
                          <>
                              <FileSpreadsheet size={48} className="text-green-500 mb-3" />
                              <span className="text-sm font-bold text-slate-700">Kéo thả file CSV/Excel vào đây</span>
                              <span className="text-xs text-slate-400 mt-1">hoặc nhấn để chọn file</span>
                          </>
                      )}
                  </div>

                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Hủy</button>
                      <button onClick={handleImport} className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-orange-700">Tiến hành</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CompetencyManager;
