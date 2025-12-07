
import React, { useState, useEffect, useRef } from 'react';
import { Save, Bot, MessageSquare, Zap, Terminal, RefreshCw, Send, Loader, History, AlertCircle, Database, Upload, FileText, CheckCircle, Trash2, Sliders, Check } from 'lucide-react';
import { CMSService } from '../../services/cmsService';
import { AIConfig, ChatSessionLog, KnowledgeBaseItem } from '../../types';
import { GoogleGenAI, Chat } from "@google/genai";

const DEFAULT_INSTRUCTION = "Bạn là My, trợ lý AI hỗ trợ học tập tại VTC Education. Hãy trả lời ngắn gọn, thân thiện và hữu ích. Tập trung vào việc giải thích các khái niệm phức tạp một cách đơn giản.";

const MentorAIManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'knowledge' | 'sandbox' | 'logs'>('config');
  const [config, setConfig] = useState<AIConfig>({
      model: 'gemini-3-pro-preview',
      temperature: 0.7,
      systemInstruction: '',
      isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
        const cfg = await CMSService.getAIConfig();
        setConfig(cfg);
        setLoading(false);
    };
    loadConfig();
  }, []);

  const handleSaveConfig = async () => {
    setSaving(true);
    setSaveSuccess(false);
    
    // Ensure we are saving the latest config state
    await CMSService.saveAIConfig(config);
    
    setSaving(false);
    setSaveSuccess(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
        {/* Tabs */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 inline-flex shadow-sm">
            {[
                { id: 'config', icon: Sliders, label: 'Cấu hình' },
                { id: 'knowledge', icon: Database, label: 'Tri thức (Knowledge)' },
                { id: 'sandbox', icon: Zap, label: 'Kiểm thử (Sandbox)' },
                { id: 'logs', icon: History, label: 'Lịch sử chat' },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                        activeTab === tab.id 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] overflow-hidden flex flex-col">
            {activeTab === 'config' && (
                <ConfigPanel 
                    config={config} 
                    setConfig={setConfig} 
                    onSave={handleSaveConfig} 
                    saving={saving} 
                    saveSuccess={saveSuccess}
                />
            )}
            {activeTab === 'knowledge' && (
                <KnowledgeBasePanel />
            )}
            {activeTab === 'sandbox' && (
                <SandboxPanel config={config} />
            )}
            {activeTab === 'logs' && (
                <LogsPanel />
            )}
        </div>
    </div>
  );
};

// --- Sub Components ---

const ConfigPanel: React.FC<{
    config: AIConfig;
    setConfig: (c: AIConfig) => void;
    onSave: () => void;
    saving: boolean;
    saveSuccess: boolean;
}> = ({ config, setConfig, onSave, saving, saveSuccess }) => (
    <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
                <h3 className="font-bold text-slate-800 text-lg">Cấu hình Prompt & Model</h3>
                <p className="text-xs text-slate-500">Thiết lập hành vi và tham số cho AI Mentor</p>
            </div>
            <button 
                onClick={onSave}
                disabled={saving}
                className={`px-6 py-2.5 text-sm font-bold rounded-xl flex items-center gap-2 disabled:opacity-70 shadow-lg transition-all ${
                    saveSuccess 
                    ? 'bg-green-500 text-white shadow-green-200' 
                    : 'bg-primary text-white hover:bg-orange-700 shadow-orange-200'
                }`}
            >
                {saving ? <Loader size={16} className="animate-spin"/> : saveSuccess ? <Check size={16} /> : <Save size={16} />}
                {saveSuccess ? 'Đã lưu!' : 'Lưu thay đổi'}
            </button>
        </div>
        
        <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                    <label className="text-sm font-bold text-slate-800">Trạng thái Bot</label>
                    <p className="text-xs text-slate-500">Bật/Tắt phản hồi tự động trên toàn hệ thống</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={config.isActive} 
                        onChange={(e) => setConfig({...config, isActive: e.target.checked})} 
                    />
                    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Model AI</label>
                    <select 
                        value={config.model}
                        onChange={(e) => setConfig({...config, model: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="gemini-3-pro-preview">Gemini 3.0 Pro (Recommended)</option>
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                        <option value="gemini-2.5-flash-thinking">Gemini 2.5 Thinking</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-2">Chọn model phù hợp với cân bằng giữa tốc độ và trí thông minh.</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nhiệt độ (Creativity): {config.temperature}</label>
                    <input 
                        type="range" 
                        min="0" max="1" step="0.1"
                        value={config.temperature}
                        onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary mt-4"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Chính xác (0.0)</span>
                        <span>Sáng tạo (1.0)</span>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Terminal size={16} className="text-slate-400"/>
                        System Instruction (Prompt)
                    </label>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">
                            {config.systemInstruction?.length || 0} ký tự
                        </span>
                        <button 
                            onClick={() => setConfig({...config, systemInstruction: DEFAULT_INSTRUCTION})}
                            className="text-xs text-slate-500 hover:text-primary font-medium flex items-center gap-1 transition-colors"
                            title="Reset to default instruction"
                        >
                            <RefreshCw size={12} /> Reset Default
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <textarea 
                        value={config.systemInstruction}
                        onChange={(e) => setConfig({...config, systemInstruction: e.target.value})}
                        className="w-full min-h-[300px] p-5 pb-8 bg-slate-900 text-slate-200 border border-slate-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary/50 outline-none resize-y leading-relaxed"
                        placeholder="Nhập hướng dẫn hệ thống cho AI..."
                    />
                    <div className="absolute top-4 right-4 px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 font-bold border border-slate-700">
                        SYSTEM
                    </div>
                </div>
                <div className="flex items-start gap-2 mt-3 p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100">
                    <AlertCircle size={16} className="shrink-0 mt-0.5"/>
                    <p className="text-xs">Thay đổi Prompt hệ thống sẽ ảnh hưởng đến tính cách và độ chính xác của câu trả lời. Hãy kiểm thử kỹ trong tab Sandbox trước khi lưu.</p>
                </div>
            </div>
        </div>
    </div>
);

const KnowledgeBasePanel: React.FC = () => {
    const [items, setItems] = useState<KnowledgeBaseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    
    // Upload Form
    const [newItem, setNewItem] = useState({ name: '', subject: '', level: 'All' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadKB();
    }, []);

    const loadKB = async () => {
        setLoading(true);
        const data = await CMSService.getKnowledgeBase();
        setItems(data);
        setLoading(false);
    };

    const handleRefresh = async () => {
        setLoading(true);
        // Add artificial delay to show loader, mimicking fetch
        await new Promise(r => setTimeout(r, 500));
        loadKB();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Auto fill name if empty
            if (!newItem.name) {
                setNewItem(prev => ({ ...prev, name: file.name }));
            }
        }
    };

    const handleUpload = async () => {
        if (!newItem.name || !newItem.subject) {
            alert("Vui lòng nhập tên tài liệu và môn học");
            return;
        }
        
        const size = selectedFile 
            ? (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB'
            : '1.5 MB'; // Mock if manual entry

        const type = selectedFile 
            ? selectedFile.name.split('.').pop() as any
            : 'pdf';

        await CMSService.addKnowledgeItem({
            name: newItem.name,
            type: type, 
            size: size, 
            tags: { subject: newItem.subject, level: newItem.level }
        });
        
        setShowUpload(false);
        setNewItem({ name: '', subject: '', level: 'All' });
        setSelectedFile(null);
        loadKB();
    };

    const handleDelete = async (id: string) => {
        if(window.confirm("Xóa tài liệu này?")) {
            await CMSService.deleteKnowledgeItem(id);
            loadKB();
        }
    };

    const openUploadModal = () => {
        setNewItem({ name: '', subject: '', level: 'All' });
        setSelectedFile(null);
        setShowUpload(true);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Cơ sở tri thức (Knowledge Base)</h3>
                    <p className="text-xs text-slate-500">Huấn luyện AI với tài liệu chuyên ngành</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleRefresh}
                        className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                        title="Làm mới trạng thái"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button 
                        onClick={openUploadModal}
                        className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-orange-700 flex items-center gap-2"
                    >
                        <Upload size={16} /> Tải tài liệu
                    </button>
                </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
                {loading ? <div className="text-center p-10"><Loader className="animate-spin inline text-primary"/></div> : (
                    <div className="grid grid-cols-1 gap-4">
                        {items.map(item => (
                            <div key={item.id} className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-400">{item.size} • {item.uploadDate}</span>
                                            {item.status === 'trained' ? (
                                                <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                                    <CheckCircle size={10}/> Trained (Ready)
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                                                    <Loader size={10} className="animate-spin"/> Processing...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                            {item.tags.subject}
                                        </span>
                                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                            {item.tags.level}
                                        </span>
                                    </div>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {items.length === 0 && <div className="text-center text-slate-400 py-10">Chưa có tài liệu nào.</div>}
                    </div>
                )}
            </div>

            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in">
                        <h3 className="font-bold text-lg mb-4">Upload Tài liệu huấn luyện</h3>
                        <div className="space-y-4">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${selectedFile ? 'border-green-300 bg-green-50' : 'border-slate-200 hover:bg-slate-50'}`}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                                {selectedFile ? (
                                    <>
                                        <FileText className="mx-auto mb-2 text-green-500" size={32} />
                                        <div className="font-bold text-green-700 text-sm">{selectedFile.name}</div>
                                        <div className="text-xs text-green-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mx-auto mb-2 opacity-50 text-slate-400" size={32}/>
                                        <span className="text-xs text-slate-500 font-bold block">Kéo thả file hoặc click để upload</span>
                                        <span className="text-[10px] text-slate-400">Hỗ trợ PDF, DOCX, TXT</span>
                                    </>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Tên hiển thị</label>
                                <input 
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary" 
                                    placeholder="VD: Giáo trình AI nâng cao"
                                    value={newItem.name}
                                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Môn học (Subject)</label>
                                <input 
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary" 
                                    placeholder="VD: Deep Learning"
                                    value={newItem.subject}
                                    onChange={e => setNewItem({...newItem, subject: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Năng lực (Level)</label>
                                <select 
                                    className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                                    value={newItem.level}
                                    onChange={e => setNewItem({...newItem, level: e.target.value})}
                                >
                                    <option value="All">All Levels</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowUpload(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Hủy</button>
                            <button onClick={handleUpload} className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-orange-700">Upload & Train</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SandboxPanel: React.FC<{ config: AIConfig }> = ({ config }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
        { role: 'model', text: 'Xin chào! Tôi là AI Mentor đã được cấu hình. Hãy thử chat để kiểm tra kiến thức của tôi.' }
    ]);
    const [loading, setLoading] = useState(false);
    
    // Simulation Context State
    const [simSubject, setSimSubject] = useState<string>('All');
    const [simLevel, setSimLevel] = useState<string>('All');
    const [uniqueSubjects, setUniqueSubjects] = useState<string[]>(['All']);

    // Fetch available subjects for dropdown
    useEffect(() => {
        CMSService.getKnowledgeBase().then(items => {
            const subjects = Array.from(new Set(items.map(i => i.tags.subject)));
            setUniqueSubjects(['All', ...subjects]);
        });
    }, []);

    const chatSession = useRef<Chat | null>(null);

    const handleSend = async () => {
        if(!input.trim() || loading) return;
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // RAG Simulation with Filtering
            const kbItems = await CMSService.getKnowledgeBase();
            
            // Filter "Trained" documents based on selected simulation context
            const relevantDocs = kbItems.filter(item => {
                const isTrained = item.status === 'trained';
                const subjectMatch = simSubject === 'All' || item.tags.subject === simSubject;
                const levelMatch = simLevel === 'All' || item.tags.level === simLevel || item.tags.level === 'All';
                return isTrained && subjectMatch && levelMatch;
            });
            
            let augmentedInstruction = config.systemInstruction;
            
            // Add context about the simulated student profile
            augmentedInstruction += `\n\n[SIMULATION CONTEXT]\nYou are currently mentoring a student studying: ${simSubject === 'All' ? 'General' : simSubject}, Level: ${simLevel}. Adjust your tone and complexity accordingly.`;

            if (relevantDocs.length > 0) {
                const knowledgeContext = relevantDocs.map(doc => 
                    `- Document: ${doc.name} (Topic: ${doc.tags.subject}, Level: ${doc.tags.level})`
                ).join('\n');
                
                augmentedInstruction += `\n\n[SYSTEM: KNOWLEDGE BASE ACTIVATED]\nUse the following RELEVANT documents as your primary source of truth:\n${knowledgeContext}\n\n[End Knowledge Base]`;
            } else {
                augmentedInstruction += `\n\n[SYSTEM: NO SPECIFIC KNOWLEDGE FOUND for Subject: ${simSubject}, Level: ${simLevel}. Use general knowledge.]`;
            }

            // Create new session every time to ensure updated config/knowledge is used
            chatSession.current = ai.chats.create({
              model: config.model,
              config: {
                 systemInstruction: augmentedInstruction,
                 temperature: config.temperature,
              },
              history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
            });
    
            const response = await chatSession.current.sendMessage({ message: userMsg });
            const botText = response.text || "No response.";
            setMessages(prev => [...prev, { role: 'model', text: botText }]);
        } catch(e: any) {
            setMessages(prev => [...prev, { role: 'model', text: `Error: ${e.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px]">
            {/* Simulation Context Toolbar */}
            <div className="p-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-indigo-600"/>
                    <span className="text-xs font-bold text-indigo-900 uppercase">Simulation Context:</span>
                </div>
                <div className="flex gap-2">
                    <select 
                        value={simSubject}
                        onChange={(e) => setSimSubject(e.target.value)}
                        className="text-xs p-1.5 border border-indigo-200 rounded-lg bg-white text-indigo-800 focus:outline-none focus:border-indigo-400"
                    >
                        {uniqueSubjects.map(s => <option key={s} value={s}>Subject: {s}</option>)}
                    </select>
                    <select 
                        value={simLevel}
                        onChange={(e) => setSimLevel(e.target.value)}
                        className="text-xs p-1.5 border border-indigo-200 rounded-lg bg-white text-indigo-800 focus:outline-none focus:border-indigo-400"
                    >
                        <option value="All">Level: All</option>
                        <option value="Beginner">Level: Beginner</option>
                        <option value="Intermediate">Level: Intermediate</option>
                        <option value="Advanced">Level: Advanced</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                            msg.role === 'user' 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 bg-white border-t border-slate-200 flex gap-3">
                <input 
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Nhập tin nhắn test..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

const LogsPanel: React.FC = () => {
    const [logs, setLogs] = useState<ChatSessionLog[]>([]);
    
    useEffect(() => {
        CMSService.getChatLogs().then(setLogs);
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">Lịch sử hội thoại</h3>
                <p className="text-xs text-slate-500">Giám sát các phiên chat gần đây của người dùng</p>
            </div>
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Chủ đề</th>
                            <th className="p-4">Sentiment</th>
                            <th className="p-4">Messages</th>
                            <th className="p-4 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-900">{log.userName}</td>
                                <td className="p-4">
                                    <div className="flex gap-1 flex-wrap">
                                        {log.topics.map(t => (
                                            <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs border border-slate-200">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        log.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                                        log.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {log.sentiment}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500">{log.messageCount} msgs</td>
                                <td className="p-4 text-right text-slate-400 font-mono text-xs">{log.startTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MentorAIManager;
