
import React, { useState } from 'react';
import { 
  CheckCircle, History, Image as ImageIcon, Info, Box, 
  ClipboardList, Tag, FileCheck, ChevronDown, RotateCcw,
  ExternalLink
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
    <div className="p-4 bg-[#f4f7fc] min-h-full space-y-4 font-['Noto_Sans_SC'] select-none">
      
      {/* 操作按钮栏 */}
      <div className="flex justify-end items-center gap-2 mb-2">
        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded text-[11px] font-bold hover:bg-slate-50 transition-all shadow-sm">
          <ExternalLink size={14} /> 外链管理
        </button>
        <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2e5ef0] text-white rounded text-[11px] font-bold hover:bg-blue-700 transition-all shadow-sm">
          <CheckCircle size={14} /> 通过
        </button>
        <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded text-[11px] font-bold hover:bg-slate-50 transition-all shadow-sm">
          驳回
        </button>
        <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded text-[11px] font-bold hover:bg-slate-50 transition-all shadow-sm">
          流程记录
        </button>
        <button 
          onClick={onBack}
          className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded text-[11px] font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          关闭
        </button>
      </div>

      {/* 核心基础信息卡片 */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
        <div className="grid grid-cols-4 gap-y-8 gap-x-8">
          {/* 第一行：流程与时间 */}
          <InfoItem label="流程编码" value={`RP${material.flowCode}0001`} />
          <InfoItem label="项目名称" value={material.projectName} />
          <InfoItem label="当前状态" value={
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(material.status)}`}>
              {getStatusLabel(material.status)}
            </span>
          } />
          <InfoItem label="提报时间" value={material.submitTime} />
          
          {/* 第二行：审核与供应商信息 */}
          <InfoItem label="审核人" value={material.auditor} />
          <InfoItem label="审核时间" value={material.auditTime || '-'} />
          <InfoItem label="提报供应商" value={material.supplier} />
          <InfoItem label="审核备注" value={material.auditRemark || '-'} />

          {/* 第三行：核心物料信息整合区 (移动至底部) */}
          <div className="col-span-4 grid grid-cols-4 gap-x-8 p-4 mt-2 -mx-4 rounded-xl border-2 border-dashed border-blue-400/30 bg-blue-50/10 relative">
            <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black text-blue-500 italic">核心物料信息整合区</div>
            <InfoItem label="商品编码" value={material.code} isMono />
            
            <div className="col-span-2 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">商品名称</div>
              <div className="p-3 border border-slate-100 rounded-lg bg-white shadow-inner min-h-[56px] flex flex-col justify-center">
                <div className="text-[12px] font-black text-slate-800 flex flex-wrap items-center gap-1">
                  <span className="text-slate-500 font-bold">[{material.brand}]</span> 
                  {material.name} {material.spec} ({material.unit})
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex gap-1 italic leading-tight">
                  <span className="shrink-0">描述：</span>
                  <span className="truncate max-w-[400px]" title={material.description}>{material.description}</span>
                </div>
              </div>
            </div>

            <InfoItem label="协议价" value={<span className="text-red-500 font-black text-sm tabular-nums">¥ {material.price.toFixed(2)}</span>} />
          </div>
        </div>
      </div>

      {/* 提报商品信息详情区 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 bg-white border-b border-slate-50 flex items-center gap-2">
          <div className="w-1 h-3.5 bg-blue-600 rounded-full" />
          <ClipboardList className="text-blue-600" size={14} />
          <span className="text-[12px] font-black text-slate-800">提报商品信息</span>
        </div>
        <div className="p-4 grid grid-cols-4 gap-x-6 gap-y-5">
          <DetailField label="类目编码" value="型材/金属制品" />
          <DetailField label="产地" value="中国" />
          <DetailField label="条形码" value="6976990718017" />
          <DetailField label="尺寸规格" value={material.spec} />
          <DetailField label="计量单位" value={material.unit} />
          <DetailField label="别名" value="不锈钢法兰" />
          <DetailField label="质保时长" value="12个月" />
          <DetailField label="外链URL" value={
            <a href="#" className="text-blue-600 hover:underline truncate inline-block w-full transition-colors">
              https://product.xh-mall.com/item/{material.code}
            </a>
          } />
        </div>
      </div>

      {/* 底部 Tab 内容区 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 min-h-[400px] flex flex-col overflow-hidden">
        <div className="flex border-b border-slate-100 bg-[#f8fafc]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3.5 text-[12px] font-black transition-all border-b-2 relative ${
                activeTab === tab.id 
                  ? 'border-[#2e5ef0] text-[#2e5ef0] bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
          ))}
        </div>

        <div className="p-6 flex-1 bg-white">
          {activeTab === 'images-panel' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-blue-600 rounded-full" />
                  <h6 className="text-[11px] font-black text-slate-800">主图</h6>
                </div>
                <div className="flex gap-4">
                  <div className="w-28 h-28 bg-white rounded-lg border border-slate-200 p-1.5 hover:border-blue-400 cursor-pointer overflow-hidden transition-all shadow-sm">
                    <img src={material.imageUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                  {[1, 2].map(i => (
                    <div key={i} className="w-28 h-28 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center transition-colors hover:bg-slate-100">
                       <ImageIcon size={28} className="text-slate-200" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-blue-600 rounded-full" />
                  <h6 className="text-[11px] font-black text-slate-800">详情图</h6>
                </div>
                <div className="flex gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="w-28 h-28 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center transition-colors hover:bg-slate-100">
                      <ImageIcon size={28} className="text-slate-200" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'images-panel' && (
             <div className="h-full flex flex-col items-center justify-center text-slate-300 py-16 bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
                <FileCheck size={56} className="mb-4 opacity-10" />
                <p className="text-[12px] font-bold text-slate-400">正在获取实时配置数据...</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: React.ReactNode; isMono?: boolean }> = ({ label, value, isMono }) => (
  <div className="space-y-1.5">
    <div className="text-[11px] font-bold text-slate-400 tracking-tight flex items-center gap-1.5">
      {label}
    </div>
    <div className={`text-[12px] font-black text-slate-700 leading-tight ${isMono ? 'font-mono tracking-tight bg-slate-100/50 px-1.5 py-0.5 rounded border border-slate-200/50 w-fit' : ''}`}>
      {value || '-'}
    </div>
  </div>
);

const DetailField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="space-y-2">
    <div className="text-[11px] font-bold text-slate-400">{label}</div>
    <div className="bg-[#f9fafb] border border-slate-100 rounded-lg px-3.5 py-2.5 text-[11px] font-black text-slate-600 min-h-[40px] flex items-center transition-all hover:bg-white hover:border-blue-200 hover:shadow-sm">
      {value}
    </div>
  </div>
);

export default MaterialDetail;
