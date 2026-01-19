
import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, CheckCircle, XCircle, History, RefreshCw, 
  Image as ImageIcon, Info, Box, ClipboardList, Tag, FileCheck
} from 'lucide-react';
import { Material, MaterialStatus } from '../types';

interface Props {
  material: Material;
  onBack: () => void;
}

const MaterialDetail: React.FC<Props> = ({ material, onBack }) => {
  const [activeTab, setActiveTab] = useState('images-panel');

  const getStatusStyle = (s: MaterialStatus) => {
    switch (s) {
      case MaterialStatus.PENDING_AUDIT: return 'bg-blue-50 text-blue-500 border-blue-100';
      case MaterialStatus.APPROVED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case MaterialStatus.REJECTED: return 'bg-red-50 text-red-400 border-red-100';
      case MaterialStatus.PUSH_FAILED: return 'bg-orange-50 text-orange-400 border-orange-100';
      case MaterialStatus.PENDING_SALES_AUDIT: return 'bg-purple-50 text-purple-600 border-purple-100';
      case MaterialStatus.SALES_AUDITING: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusLabel = (s: MaterialStatus) => {
    const labels: Record<string, string> = {
      [MaterialStatus.ALL]: '全部',
      [MaterialStatus.PENDING_AUDIT]: '待审核',
      [MaterialStatus.REJECTED]: '已驳回',
      [MaterialStatus.APPROVED]: '审核通过',
      [MaterialStatus.PUSHED]: '已推送',
      [MaterialStatus.PUSH_FAILED]: '推送失败',
      [MaterialStatus.PENDING_SALES_AUDIT]: '待销售审核',
      [MaterialStatus.SALES_AUDITING]: '销售审核中',
    };
    return labels[s] || s;
  };

  const tabs = [
    { id: 'images-panel', label: '商品图片', icon: <ImageIcon size={14} /> },
    { id: 'main-panel', label: '主要信息', icon: <Info size={14} /> },
    { id: 'secondary-panel', label: '次要信息', icon: <Box size={14} /> },
    { id: 'tags-panel', label: '商品标签', icon: <Tag size={14} /> },
    { id: 'attachments-panel', label: '资料附件', icon: <ClipboardList size={14} /> },
  ];

  return (
    <div className="p-6 bg-[#f5f5f5] min-h-full space-y-4">
      
      {/* 核心信息区与操作栏 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex justify-end gap-3 pb-6 border-b border-slate-100 mb-6">
          <button className="px-4 py-1.5 bg-[#2e5ef0] text-white rounded text-[11px] font-black shadow hover:bg-blue-700 flex items-center gap-1.5 transition-all">
            <CheckCircle size={14} /> 通过
          </button>
          <button className="px-4 py-1.5 text-[#2e5ef0] hover:bg-blue-50 rounded text-[11px] font-black transition-colors">
            驳回
          </button>
          <button className="px-4 py-1.5 text-[#2e5ef0] hover:bg-blue-50 rounded text-[11px] font-black transition-colors">
            流程记录
          </button>
          <button className="px-4 py-1.5 bg-[#2e5ef0] text-white rounded text-[11px] font-black shadow hover:bg-blue-700 flex items-center gap-1.5 transition-all">
            <RefreshCw size={14} /> 重新推送
          </button>
          <button onClick={onBack} className="px-4 py-1.5 text-[#2e5ef0] hover:bg-blue-50 rounded text-[11px] font-black transition-colors flex items-center gap-1.5">
            <ArrowLeft size={14} /> 返回列表
          </button>
        </div>

        <div className="grid grid-cols-4 gap-y-10 gap-x-6">
          <InfoItem label="流程编码" value={`RP${material.flowCode}0001`} />
          <InfoItem label="项目名称" value={material.projectName} />
          <InfoItem label="当前状态" value={
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border whitespace-nowrap ${getStatusStyle(material.status)}`}>
              {getStatusLabel(material.status)}
            </span>
          } />
          <InfoItem label="提报时间" value={material.submitTime} />
          
          <InfoItem label="商品编码" value={material.code} isMono />
          
          {/* 合并显示的商品名称项 */}
          <div className="space-y-1.5 col-span-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              商品名称
            </div>
            <div className="p-2 border-2 border-dashed border-blue-200 rounded-md bg-blue-50/20">
              <div className="text-[12px] font-black text-slate-900 leading-snug">
                {/* 取消标蓝：将 text-blue-700 改为 text-slate-500 */}
                <span className="text-slate-500 mr-1">[{material.brand}]</span> 
                {material.name} {material.spec} <span className="text-slate-400 font-bold ml-1">({material.unit})</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate" title={material.description}>
                描述：{material.description}
              </div>
            </div>
          </div>

          <InfoItem label="协议价" value={<span className="text-red-500 font-black text-sm">¥ {material.price.toFixed(2)}</span>} />
          <InfoItem label="提报供应商" value={material.supplier} />
        </div>
      </div>

      {/* 提报商品信息模块 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 text-[#2e5ef0] font-black text-sm mb-6 pb-2 border-b border-slate-50">
          <ClipboardList size={18} /> 提报商品信息
        </div>
        <div className="grid grid-cols-4 gap-6">
          <FormField label="类目编码" value="型材/金属制品" />
          <FormField label="产地" value="中国" />
          <FormField label="条形码" value="6976990718017" />
          <FormField label="尺寸规格" value={material.spec} />
          <FormField label="计量单位" value={material.unit} />
          <FormField label="别名" value={material.name} />
          <FormField label="质保时长" value="12个月" />
          <FormField label="外链URL" value={<a href="#" className="text-blue-600 hover:underline truncate inline-block w-full">https://product.xh-mall.com/item/{material.code}</a>} />
        </div>
      </div>

      {/* 内部 Tab 滑块容器 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
        {/* Tab 导航 */}
        <div className="flex border-b border-slate-100 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-black transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-[#2e5ef0] text-[#2e5ef0]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 内容区 */}
        <div className="p-8 flex-1">
          {activeTab === 'images-panel' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-4">
                <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">主图</h6>
                <div className="flex gap-4">
                  <div className="w-28 h-28 bg-slate-50 rounded-lg border border-slate-200 p-1 group hover:border-blue-400 cursor-pointer overflow-hidden transition-all shadow-sm">
                    <img src={material.imageUrl} alt="" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  {[1, 2].map(i => (
                    <div key={i} className="w-28 h-28 bg-slate-50 rounded-lg border border-slate-200 p-1 group hover:border-blue-400 cursor-pointer overflow-hidden transition-all shadow-sm flex items-center justify-center">
                       <ImageIcon size={24} className="text-slate-200" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">详情图</h6>
                <div className="flex gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="w-28 h-28 bg-slate-50 rounded-lg border border-slate-200 p-1 hover:border-blue-400 cursor-pointer overflow-hidden transition-all shadow-sm flex items-center justify-center">
                      <ImageIcon size={24} className="text-slate-200" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'main-panel' && (
            <div className="grid grid-cols-3 gap-y-8 gap-x-12 animate-in fade-in duration-300">
              <FormField label="品牌" value={material.brand} required />
              <FormField label="型号" value={material.spec} required />
              <FormField label="类目" value="型材 > 金属制品" required />
              <FormField label="单位" value={material.unit} required />
              <FormField label="税率" value="13% 增值税" required />
              <FormField label="协议价" value={`¥ ${material.price.toFixed(2)}`} required />
            </div>
          )}

          {activeTab === 'secondary-panel' && (
             <div className="grid grid-cols-3 gap-y-8 gap-x-12 animate-in fade-in duration-300">
                <FormField label="供应商名称" value={material.supplier} />
                <FormField label="税收分类名称" value="其他金属制品" />
                <FormField label="商城状态" value={getStatusLabel(material.status)} />
                <FormField label="是否停产" value="否" />
             </div>
          )}

          {activeTab === 'tags-panel' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400">项目标签</label>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black border border-blue-100">{material.projectName}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400">品牌标签</label>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black border border-slate-100">非代理品牌</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attachments-panel' && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 animate-in fade-in duration-300 py-12">
               <FileCheck size={48} className="mb-3 opacity-20" />
               <p className="text-xs font-bold text-slate-400">暂无相关附件资料</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: React.ReactNode; isMono?: boolean }> = ({ label, value, isMono }) => (
  <div className="space-y-1">
    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    <div className={`text-[12px] font-black text-slate-800 ${isMono ? 'font-mono' : ''}`}>{value}</div>
  </div>
);

const FormField: React.FC<{ label: string; value: React.ReactNode; required?: boolean }> = ({ label, value, required }) => (
  <div className="space-y-2">
    <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
      {required && <span className="text-red-500">*</span>} {label}
    </div>
    <div className="bg-[#f9fafb] border border-slate-100 rounded px-3 py-2 text-[11px] font-bold text-slate-700 min-h-[36px] flex items-center transition-colors hover:border-blue-100">
      {value}
    </div>
  </div>
);

export default MaterialDetail;
