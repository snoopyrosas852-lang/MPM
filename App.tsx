
import React, { useState } from 'react';
import { 
  Home, X, ChevronDown, Flame, AlertCircle
} from 'lucide-react';
import MaterialList from './components/MaterialList';
import ProjectConfig from './components/ProjectConfig';
import ReviewerConfig from './components/ReviewerConfig';
import MaterialDetail from './components/MaterialDetail';
import { Material } from './types';

enum View {
  MATERIAL_LIST = 'MATERIAL_LIST',
  PROJECT_CONFIG = 'PROJECT_CONFIG',
  REVIEWER_CONFIG = 'REVIEWER_CONFIG',
  MATERIAL_DETAIL = 'MATERIAL_DETAIL'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.MATERIAL_LIST);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showError, setShowError] = useState(false);

  const handleOpenDetail = (material: Material) => {
    setSelectedMaterial(material);
    setCurrentView(View.MATERIAL_DETAIL);
  };

  const handleCloseDetail = () => {
    setSelectedMaterial(null);
    setCurrentView(View.MATERIAL_LIST);
  };

  return (
    <div className="flex flex-col h-screen font-['Noto_Sans_SC']">
      {/* 顶部蓝色功能条 */}
      <header className="h-10 bg-[#2e5ef0] flex items-center justify-between px-4 shrink-0 text-white shadow-md z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-black tracking-tight">咸亨国际主数据管理平台</h1>
          </div>
          <button className="flex items-center gap-1.5 text-xs bg-white/10 px-2.5 py-1 rounded hover:bg-white/20 transition-all">
            <Flame size={14} className="text-orange-400 fill-orange-400" />
            <span className="font-bold">切换系统</span>
          </button>
        </div>
        
        <div className="flex items-center gap-6 text-[11px] font-medium">
          <div className="flex items-center gap-4 opacity-90">
            <span className="cursor-pointer hover:text-blue-200">版本更新</span>
            <span className="cursor-pointer hover:text-blue-200">推送ERP</span>
          </div>
          <div className="w-px h-3 bg-white/20"></div>
          <div className="flex items-center gap-5">
            <span className="cursor-pointer flex items-center gap-1.5 group">
              <div className="w-2 h-2 bg-red-500 rounded-full group-hover:scale-125 transition-transform"></div>
              任务中心
            </span>
            <span className="cursor-pointer flex items-center gap-1.5 group">
              <div className="w-2 h-2 bg-red-500 rounded-full group-hover:scale-125 transition-transform"></div>
              清洗任务
            </span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-all ml-2">
            <span className="font-bold">江政韬</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </header>

      {/* 导航标签栏 */}
      <nav className="h-9 bg-[#4090ff] flex items-center px-1 shrink-0 gap-0.5">
        <button 
          onClick={() => setCurrentView(View.MATERIAL_LIST)}
          className="w-10 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <Home size={18} />
        </button>
        
        <div className="flex items-end h-full gap-0.5">
          <div 
            onClick={() => setCurrentView(View.MATERIAL_LIST)}
            className={`h-8 px-5 flex items-center gap-4 text-xs font-bold cursor-pointer transition-all border-r border-white/10 ${currentView === View.MATERIAL_LIST ? 'tab-active' : 'text-white/90 hover:bg-white/10'}`}
          >
            <span>待推送物料列表</span>
          </div>
          
          {selectedMaterial && (
            <div 
              onClick={() => setCurrentView(View.MATERIAL_DETAIL)}
              className={`h-8 px-5 flex items-center gap-4 text-xs font-bold cursor-pointer transition-all border-r border-white/10 animate-in slide-in-from-left-2 ${currentView === View.MATERIAL_DETAIL ? 'tab-active' : 'text-white/90 hover:bg-white/10'}`}
            >
              <span>提报商品详情</span>
              <X size={12} className="opacity-40 hover:opacity-100 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleCloseDetail(); }} />
            </div>
          )}

          {currentView === View.PROJECT_CONFIG && (
            <div className="h-8 px-5 flex items-center gap-4 text-xs font-bold cursor-pointer tab-active animate-in slide-in-from-left-2">
              <span>项目提报配置</span>
              <X size={12} className="opacity-40 hover:opacity-100" onClick={() => setCurrentView(View.MATERIAL_LIST)} />
            </div>
          )}
          
          {currentView === View.REVIEWER_CONFIG && (
            <div className="h-8 px-5 flex items-center gap-4 text-xs font-bold cursor-pointer tab-active animate-in slide-in-from-left-2">
              <span>商品审核人配置</span>
              <X size={12} className="opacity-40 hover:opacity-100" onClick={() => setCurrentView(View.MATERIAL_LIST)} />
            </div>
          )}
        </div>
        
        <div className="ml-auto pr-4">
          <button className="text-white text-[10px] font-black opacity-80 hover:opacity-100 hover:underline">清除全部页签</button>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="flex-1 bg-[#f4f7fc] overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-auto custom-scrollbar">
          {currentView === View.MATERIAL_LIST && (
            <MaterialList 
              onOpenReviewerConfig={() => setCurrentView(View.REVIEWER_CONFIG)}
              onOpenProjectConfig={() => setCurrentView(View.PROJECT_CONFIG)}
              onOpenDetail={handleOpenDetail}
            />
          )}
          {currentView === View.MATERIAL_DETAIL && selectedMaterial && (
            <MaterialDetail material={selectedMaterial} onBack={handleCloseDetail} />
          )}
          {currentView === View.PROJECT_CONFIG && <ProjectConfig onBack={() => setCurrentView(View.MATERIAL_LIST)} />}
          {currentView === View.REVIEWER_CONFIG && <ReviewerConfig />}
        </div>

        {showError && (
          <div className="absolute bottom-6 right-6 w-85 bg-white border border-red-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] rounded-xl p-4 animate-in slide-in-from-right duration-500 flex gap-4 items-start z-[1000] border-l-4 border-l-red-500">
            <div className="bg-red-50 p-2 rounded-xl">
              <AlertCircle className="text-red-500" size={22} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-slate-800">服务异常</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">网络连接发生抖动或由于会话超时，刷新页面重试。</p>
            </div>
            <button onClick={() => setShowError(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
