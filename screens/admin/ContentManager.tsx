
import React, { useState, useEffect, useRef } from 'react';
import { Library, Plus, Search, FileText, Video, File, Edit2, Trash2, X, Save, UploadCloud, Eye, CheckCircle } from 'lucide-react';
import { CMSService } from '../../services/cmsService';
import { ContentItem } from '../../types';

const ContentManager: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'video' | 'article' | 'document'>('All');
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'video' as 'video' | 'article' | 'document',
    status: 'published' as 'published' | 'draft',
    category: '',
    duration: '',
  });

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await CMSService.getContent();
    setItems(data);
    setLoading(false);
  };

  const handleOpenModal = (item?: ContentItem) => {
    setSelectedFile(null);
    setIsUploading(false);
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        type: item.type,
        status: item.status as any,
        category: item.category,
        duration: item.duration || '',
      });
    } else {
      setEditingItem(null);
      setFormData({ title: '', type: 'video', status: 'published', category: '', duration: '' });
    }
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setSelectedFile(file);
          
          // Auto-fill title if empty
          if (!formData.title) {
              setFormData(prev => ({ ...prev, title: file.name.split('.')[0] }));
          }
          
          // Auto-detect type based on extension
          if (file.type.startsWith('video/')) {
              setFormData(prev => ({ ...prev, type: 'video', duration: 'Đang tính toán...' }));
              // Simulate duration calculation
              setTimeout(() => {
                  setFormData(prev => ({ ...prev, duration: '12:30' })); // Mock duration
              }, 1000);
          } else if (file.type.includes('pdf')) {
              setFormData(prev => ({ ...prev, type: 'document' }));
          }
      }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.category) {
        alert("Vui lòng nhập tiêu đề và danh mục!");
        return;
    }

    // Simulate Upload Process if file is selected
    if (selectedFile && !editingItem) {
        setIsUploading(true);
        await new Promise(r => setTimeout(r, 1500)); // Mock upload delay
        setIsUploading(false);
    }

    if (editingItem) {
      await CMSService.updateContent({
        ...editingItem,
        ...formData,
        lastModified: new Date().toISOString().split('T')[0]
      });
    } else {
      await CMSService.addContent({
        ...formData,
        author: 'Admin', // Default author
      });
    }
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa nội dung này?')) {
      await CMSService.deleteContent(id);
      loadData();
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return <Video size={18} className="text-orange-500"/>;
      case 'article': return <FileText size={18} className="text-blue-500"/>;
      case 'document': return <File size={18} className="text-red-500"/>;
      default: return <File size={18} />;
    }
  };

  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'published': return 'Đã xuất bản';
          case 'draft': return 'Bản nháp';
          case 'archived': return 'Lưu trữ';
          default: return status;
      }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-700 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm nội dung..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <option value="All">Tất cả loại</option>
            <option value="video">Bài giảng Video</option>
            <option value="article">Bài viết/Blog</option>
            <option value="document">Tài liệu PDF</option>
          </select>
          
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus size={16}/> Thêm mới
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        {loading ? (
           <div className="p-10 text-center text-slate-400">Đang tải dữ liệu...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Nội dung</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Tác giả/Ngày</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{item.title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                           <span className="capitalize">{item.type === 'video' ? 'Video' : item.type === 'document' ? 'Tài liệu' : 'Bài viết'}</span>
                           {item.duration && <span>• {item.duration}</span>}
                           {item.views !== undefined && <span className="flex items-center gap-1"><Eye size={10}/> {item.views}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <div className="font-bold text-slate-700">{item.author}</div>
                    <div>{item.lastModified}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                   <td colSpan={5} className="p-8 text-center text-slate-400">Không tìm thấy nội dung nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">{editingItem ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              
              {/* File Upload Area */}
              {!editingItem && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedFile ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-primary hover:bg-orange-50'}`}
                  >
                      <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="video/*, .pdf"
                          onChange={handleFileChange} 
                      />
                      {selectedFile ? (
                          <>
                              <CheckCircle size={32} className="mb-2 text-green-500"/>
                              <span className="text-sm font-bold text-green-700">{selectedFile.name}</span>
                              <span className="text-xs text-green-600 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Sẵn sàng tải lên</span>
                          </>
                      ) : (
                          <>
                              <UploadCloud size={32} className="mb-2 text-slate-400"/>
                              <span className="text-sm font-bold text-slate-600">Kéo thả Video/File vào đây</span>
                              <span className="text-xs text-slate-400 mt-1">Hỗ trợ MP4, MOV, PDF</span>
                          </>
                      )}
                  </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tiêu đề</label>
                <input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Nhập tiêu đề..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Loại nội dung</label>
                   <select 
                     value={formData.type}
                     onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                     className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                   >
                     <option value="video">Bài giảng Video</option>
                     <option value="article">Bài viết/Blog</option>
                     <option value="document">Tài liệu PDF</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Trạng thái</label>
                   <select 
                     value={formData.status}
                     onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                     className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                   >
                     <option value="published">Đã xuất bản</option>
                     <option value="draft">Bản nháp</option>
                     <option value="archived">Lưu trữ</option>
                   </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Danh mục</label>
                    <input 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                      placeholder="VD: AI Basics"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Thời lượng (Tùy chọn)</label>
                    <input 
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none"
                      placeholder="VD: 10:35"
                    />
                 </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
               <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg">Hủy</button>
               <button 
                  onClick={handleSave} 
                  disabled={isUploading}
                  className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-orange-700 shadow-lg shadow-orange-200 flex items-center gap-2 disabled:opacity-70"
               >
                  {isUploading ? 'Đang tải lên...' : <><Save size={16} /> {editingItem ? 'Cập nhật' : 'Lưu nội dung'}</>}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
