
import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, X, ArrowRight, BookOpen, AlertTriangle, CheckCircle, Save, RotateCcw } from 'lucide-react';
import { CMSService } from '../../services/cmsService';
import { AdaptiveNode } from '../../types';

const AdaptiveCourseBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<AdaptiveNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadWorkflow();
  }, []);

  const loadWorkflow = async () => {
    setLoading(true);
    const data = await CMSService.getWorkflow();
    setNodes(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await CMSService.saveWorkflow(nodes);
    setSaving(false);
    alert('Workflow saved successfully!');
  };

  if (loading) return <div className="p-10 text-center">Loading Workflow...</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      {/* Editor Canvas */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
                <GitBranch size={20} className="text-primary" />
                Adaptive Workflow Editor
            </h2>
            <div className="flex gap-2">
                <button onClick={loadWorkflow} className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
                    <RotateCcw size={14} /> Reset
                </button>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-2 disabled:opacity-70"
                >
                    <Save size={14} />
                    {saving ? 'Saving...' : 'Save Workflow'}
                </button>
            </div>
        </div>
        
        <div className="flex-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-slate-50 p-8 overflow-auto relative">
            <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto">
                {/* Visualizing the flow simply for the demo using the fetched nodes */}
                {/* Note: A real graph lib like ReactFlow would be used here. We mock the visualization structure based on indices for demo purposes. */}
                
                {nodes.length > 0 && (
                    <>
                        <Node data={nodes[0]} isStart />
                        <ArrowDown />
                        
                        <Node data={nodes[1]} />
                        
                        {/* Branching Logic (Hardcoded visualization for the specific seed data structure) */}
                        <div className="grid grid-cols-2 gap-12 w-full relative">
                            <div className="absolute top-0 left-1/2 w-0 h-8 border-l-2 border-dashed border-slate-300 -translate-y-8"></div>
                            <div className="absolute top-0 left-1/4 right-1/4 h-0 border-t-2 border-dashed border-slate-300"></div>
                            <div className="absolute top-0 left-1/4 h-8 border-l-2 border-dashed border-slate-300"></div>
                            <div className="absolute top-0 right-1/4 h-8 border-r-2 border-dashed border-slate-300"></div>

                            <div className="flex flex-col items-center mt-8">
                                <div className="mb-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md">Score &lt; 50%</div>
                                {nodes[3] && <Node data={nodes[3]} />}
                                <div className="mt-2 text-xs text-slate-400 font-medium flex items-center gap-1">
                                    <ArrowRight size={12}/> Re-take Quiz
                                </div>
                            </div>

                            <div className="flex flex-col items-center mt-8">
                                <div className="mb-2 bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded-md">Score &gt; 50%</div>
                                {nodes[2] && <Node data={nodes[2]} />}
                                <ArrowDown />
                                {nodes[4] && <Node data={nodes[4]} isEnd />}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">Node Properties</h3>
        </div>
        <div className="p-4 space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Điều kiện Adaptive</label>
                <div className="space-y-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-slate-700">If Score &lt; 50%</span>
                            <button className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                        </div>
                        <select className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white">
                            <option>Redirect to: Bài 1.5 (Remedial)</option>
                            <option>Assign Mentor</option>
                        </select>
                    </div>
                    <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-bold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                        <Plus size={16}/> Add Rule
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nội dung (Content)</label>
                <div className="p-3 border border-slate-200 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <BookOpen size={20}/>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-800">Video 15min</div>
                        <div className="text-xs text-slate-500">Resource ID: #8291</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const Node: React.FC<{ data: AdaptiveNode, isStart?: boolean, isEnd?: boolean }> = ({ data, isStart, isEnd }) => {
    const colors = {
        lesson: 'border-blue-200 bg-blue-50 text-blue-700',
        quiz: 'border-purple-200 bg-purple-50 text-purple-700',
        remedial: 'border-orange-200 bg-orange-50 text-orange-700',
        project: 'border-green-200 bg-green-50 text-green-700',
    };

    return (
        <div className={`
            w-48 p-4 rounded-xl border-2 shadow-sm relative transition-transform hover:-translate-y-1 cursor-pointer
            ${colors[data.type] || 'bg-white border-slate-200'}
        `}>
            {isStart && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">START</div>}
            
            <div className="flex items-center gap-2 mb-1">
                {data.type === 'quiz' ? <AlertTriangle size={14}/> : data.type === 'remedial' ? <BookOpen size={14}/> : <CheckCircle size={14}/>}
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{data.type}</span>
            </div>
            <h4 className="font-bold text-sm leading-tight">{data.title}</h4>

            {isEnd && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">GOAL</div>}
        </div>
    );
};

const ArrowDown = () => (
    <div className="h-8 w-0 border-l-2 border-dashed border-slate-300 my-1"></div>
);

export default AdaptiveCourseBuilder;
