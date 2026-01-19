
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, RotateCcw, Settings2, Check, Layout, X, Info,
  ArrowUpDown, ChevronUp, ChevronDown, Filter, ChevronRight
} from 'lucide-react';
import { Material, MaterialStatus, SubmissionType, SubmissionSource } from '../types';

const MOCK_DATA: Material[] = [
  { id: '1', projectName: '管网新系统', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018369', name: '不锈钢法兰', spec: 'DN50 PN16', brand: 'MAT001', unit: '个', price: 100.00, flowCode: 'PRDDD100001', submissionSource: SubmissionSource.SCP, supplier: '管网新系统甲', submitTime: '2025-12-08 14:30', status: MaterialStatus.PENDING_AUDIT, submissionType: SubmissionType.NEW, description: '耐高压防腐蚀型测试场生成色冯绍峰撒旦法受打击考拉封闭啊哈手打hi发受打破饭卡拉萨放哪拉卡萨到哪看理发年卡老地方啊', auditTime: '-', auditor: '江政韬', auditRemark: '待技术部核准图纸' },
  { id: '2', projectName: '国网商城', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018329', name: '碳钢阀门', spec: 'DN50 PN16', brand: 'MAT001', unit: '个', price: 100.00, flowCode: 'PRDDD100021', submissionSource: SubmissionSource.COMMODITY_DEPT, supplier: '国网商城乙', submitTime: '2025-12-08 10:15', status: MaterialStatus.PUSH_FAILED, submissionType: SubmissionType.UPDATE, description: '标准碳钢材质', auditTime: '2025-12-08 14:30', auditor: '计碧萍', auditRemark: '资料完整，推送异常，需联系ERP管理员' },
  { id: '3', projectName: '航发新系统', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018349', name: '压力表', spec: '0-1.6MPa', brand: 'MAT001', unit: '个', price: 100.00, flowCode: 'PRDDD100002', submissionSource: SubmissionSource.SCP, supplier: '航发新系统丙', submitTime: '2025-12-07 16:45', status: MaterialStatus.REJECTED, submissionType: SubmissionType.PRICE_CHANGE, description: '高精度工业级', auditTime: '2025-12-08 14:30', auditor: '张三', auditRemark: '商品图片不符合平台规范，请重新拍摄背景' },
  { id: '4', projectName: '管网新系统', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018388', name: '密封圈', spec: 'OD100mm', brand: 'MAT002', unit: '件', price: 12.50, flowCode: 'PRDDD100005', submissionSource: SubmissionSource.SCP, supplier: '中化国际', submitTime: '2025-12-09 09:00', status: MaterialStatus.PENDING_AUDIT, submissionType: SubmissionType.NEW, description: '耐油橡胶材质', auditTime: '-', auditor: '江政韬', auditRemark: '' },
  { id: '5', projectName: '管网新系统', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018399', name: '控制手柄', spec: '通用型', brand: 'MAT003', unit: '台', price: 450.00, flowCode: 'PRDDD100010', submissionSource: SubmissionSource.COMMODITY_DEPT, supplier: '咸亨智造', submitTime: '2025-12-09 11:20', status: MaterialStatus.SALES_AUDITING, submissionType: SubmissionType.RE_PUSH, description: '人体工程学设计', auditTime: '2025-12-09 13:45', auditor: '江政韬', auditRemark: '转交给销售部二次定价' },
];

interface Props {
  onOpenReviewerConfig: () => void;
  onOpenProjectConfig: () => void;
  onOpenDetail: (material: Material) => void;
}

interface FilterOption {
  key: string;
  label: string;
  visible: boolean;
  isPermanent?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;
interface SortConfig {
  key: keyof Material | '';
  direction: SortDirection;
}

const MaterialList: React.FC<Props> = ({ onOpenReviewerConfig, onOpenProjectConfig, onOpenDetail }) => {
  const [activeStatus, setActiveStatus] = useState<MaterialStatus>(MaterialStatus.ALL);
  const [showFilterConfig, setShowFilterConfig] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });

  const [colWidths, setColWidths] = useState<Record<string, number>>({
    selection: 40,
    ops: 120,
    flowId: 130,
    source: 90,
    project: 120,
    subType: 80,
    productInfo: 300,
    code: 110,
    price: 90,
    status: 100,
    auditor: 100,
    submitTime: 160,
    auditTime: 160,
    auditRemark: 200,
    supplier: 180,
  });

  const resizingCol = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    { key: 'projectName', label: '项目名称', visible: true },
    { key: 'code', label: '物料编码', visible: true },
    { key: 'name', label: '商品名称', visible: true },
    { key: 'submissionType', label: '提报类型', visible: true },
    { key: 'supplier', label: '提报供应商', visible: true },
    { key: 'auditor', label: '审核人', visible: true },
    { key: 'priceRange', label: '协议价范围', visible: true },
    { key: 'submitTime', label: '提报时间', visible: true },
    { key: 'auditTime', label: '审核时间', visible: true },
    { key: 'auditRemark', label: '审核备注', visible: true },
    { key: 'submissionSource', label: '提报来源', visible: false },
    { key: 'flowCode', label: '审批流编码', visible: true },
  ]);

  const configRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (configRef.current && !configRef.current.contains(event.target as Node)) {
        setShowFilterConfig(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingCol.current) return;
      const deltaX = e.clientX - startX.current;
      const newWidth = Math.max(50, startWidth.current + deltaX);
      setColWidths(prev => ({ ...prev, [resizingCol.current!]: newWidth }));
    };

    const handleMouseUp = () => {
      resizingCol.current = null;
      document.body.style.cursor = 'default';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const onResizeStart = (e: React.MouseEvent, key: string) => {
    resizingCol.current = key;
    startX.current = e.clientX;
    startWidth.current = colWidths[key];
    document.body.style.cursor = 'col-resize';
    e.preventDefault();
  };

  const handleSort = (key: keyof Material) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: '', direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  const processedData = useMemo(() => {
    let data = [...MOCK_DATA];
    if (activeStatus !== MaterialStatus.ALL) {
      data = data.filter(item => item.status === activeStatus);
    }
    if (sortConfig.key && sortConfig.direction) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key as keyof Material]?.toString() || '';
        const valB = b[sortConfig.key as keyof Material]?.toString() || '';
        if (valA === '-' || valA === '') return 1;
        if (valB === '-' || valB === '') return -1;
        return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return data;
  }, [activeStatus, sortConfig]);

  const toggleFilterVisibility = (key: string) => {
    setFilterOptions(prev => prev.map(opt => 
      opt.key === key ? { ...opt, visible: !opt.visible } : opt
    ));
  };

  const handleSelectAll = () => {
    setFilterOptions(prev => prev.map(opt => ({ ...opt, visible: true })));
  };

  const handleResetDefault = () => {
    const defaults = ['projectName', 'code', 'name', 'submissionType', 'supplier', 'auditor', 'priceRange', 'submitTime', 'auditTime', 'flowCode'];
    setFilterOptions(prev => prev.map(opt => ({ ...opt, visible: defaults.includes(opt.key) })));
  };

  const getStatusStyle = (s: MaterialStatus) => {
    switch (s) {
      case MaterialStatus.PENDING_AUDIT: return 'bg-blue-50 text-blue-600 border-blue-200';
      case MaterialStatus.APPROVED: return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case MaterialStatus.REJECTED: return 'bg-red-50 text-red-500 border-red-200';
      case MaterialStatus.PUSH_FAILED: return 'bg-orange-50 text-orange-600 border-orange-200';
      case MaterialStatus.SALES_AUDITING: return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
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

  const visibleFilters = filterOptions.filter(f => f.visible);

  return (
    <div className="flex flex-col h-full bg-[#f4f7fc]">
      {/* 增强型筛选面板 */}
      <div className="bg-white m-4 mb-2 rounded-xl border border-slate-200 shadow-sm p-5 relative">
        <div className="grid grid-cols-4 gap-x-8 gap-y-4 items-end">
          {filterOptions.find(f => f.key === 'projectName' && f.visible) && (
            <SearchItem label="项目名称">
              <select className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 text-slate-700 font-bold transition-all">
                <option value="">请选择项目</option>
                <option>管网新系统</option>
                <option>国网商城</option>
              </select>
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'code' && f.visible) && (
            <SearchItem label="物料编码">
              <input type="text" placeholder="多个编码用逗号隔开" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-bold transition-all" />
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'name' && f.visible) && (
            <SearchItem label="商品名称">
              <input type="text" placeholder="请输入商品名称关键词" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-bold transition-all" />
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'submissionType' && f.visible) && (
            <SearchItem label="提报类型">
              <select className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-bold transition-all">
                <option value="">全部类型</option>
                {Object.values(SubmissionType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'supplier' && f.visible) && (
            <SearchItem label="提报供应商">
              <input type="text" placeholder="请输入供应商名称" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-bold transition-all" />
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'auditor' && f.visible) && (
            <SearchItem label="审核人">
              <input type="text" placeholder="请输入审核人姓名" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-bold transition-all" />
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'submitTime' && f.visible) && (
            <SearchItem label="提报时间">
              <input type="date" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 text-slate-700 font-bold transition-all" />
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'auditTime' && f.visible) && (
            <SearchItem label="审核时间">
              <input type="date" className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 text-slate-700 font-bold transition-all" />
            </SearchItem>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <div className="flex gap-2" ref={configRef}>
            <button 
              onClick={() => setShowFilterConfig(!showFilterConfig)}
              className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95"
            >
              <Settings2 size={15} className="group-hover:rotate-45 transition-transform duration-300" />
              配置筛项
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 active:scale-95 transition-all">
              <RotateCcw size={15} /> 重置
            </button>
            <button className="flex items-center gap-2 px-8 py-2 bg-[#2e5ef0] text-white rounded-lg text-xs font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95">
              <Search size={15} /> 查询
            </button>

            {showFilterConfig && (
              <div className="absolute right-0 top-full mt-3 w-[340px] bg-white border border-slate-200 shadow-2xl rounded-2xl z-[100] animate-in fade-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-black/5">
                <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Layout size={16} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-black text-slate-800 tracking-tight">配置表格显示字段</span>
                  </div>
                  <button onClick={() => setShowFilterConfig(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-5 max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">可用展示列</span>
                    <div className="flex gap-4">
                      <button onClick={handleSelectAll} className="text-[11px] font-black text-blue-600 hover:underline">全选</button>
                      <button onClick={handleResetDefault} className="text-[11px] font-black text-slate-500 hover:underline">重置默认</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {filterOptions.map(opt => (
                      <label key={opt.key} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer border transition-all ${opt.visible ? 'bg-blue-50/50 border-blue-200 ring-2 ring-blue-500/5' : 'border-slate-100 hover:border-slate-300'}`}>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${opt.visible ? 'bg-blue-600 border-blue-600 shadow-sm' : 'bg-white border-slate-300'}`}>
                          {opt.visible && <Check size={12} className="text-white" strokeWidth={3} />}
                          <input type="checkbox" className="hidden" checked={opt.visible} onChange={() => toggleFilterVisibility(opt.key)} />
                        </div>
                        <span className={`text-xs font-bold ${opt.visible ? 'text-blue-700' : 'text-slate-600'}`}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-500">已选 {visibleFilters.length} 个字段</span>
                  <button onClick={() => setShowFilterConfig(false)} className="px-6 py-2 bg-[#2e5ef0] text-white rounded-xl text-xs font-black shadow-md hover:bg-blue-700 transition-all active:scale-95">保存设置</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 状态滑块 - 优化 */}
      <div className="mx-4 mb-4 flex gap-1 items-center bg-slate-200/50 p-1.5 rounded-xl w-fit shadow-inner">
        {Object.values(MaterialStatus).map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-5 py-2 text-xs font-black transition-all rounded-lg ${
              activeStatus === s 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
            }`}
          >
            {getStatusLabel(s)}
          </button>
        ))}
      </div>

      {/* 批量操作 - 优化 */}
      <div className="mx-4 mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          {['批量重推', '批量审核', '提交销售审核', '导出物料', '导出明细'].map(btn => (
            <button key={btn} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95">
              {btn}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onOpenReviewerConfig} className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95">
             <Filter size={14} /> 商品审核人配置
          </button>
          <button onClick={onOpenProjectConfig} className="flex items-center gap-2 px-5 py-2 bg-[#2e5ef0] text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
             项目提报配置 <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 数据表格 - 样式调整：取消 ID 的蓝色 */}
      <div className="mx-4 mb-4 flex-1 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full border-collapse table-fixed select-none">
            <colgroup>
              <col style={{ width: colWidths.selection }} />
              <col style={{ width: colWidths.ops }} />
              <col style={{ width: colWidths.flowId }} />
              <col style={{ width: colWidths.source }} />
              <col style={{ width: colWidths.project }} />
              <col style={{ width: colWidths.subType }} />
              <col style={{ width: colWidths.productInfo }} />
              <col style={{ width: colWidths.code }} />
              <col style={{ width: colWidths.price }} />
              <col style={{ width: colWidths.status }} />
              <col style={{ width: colWidths.auditor }} />
              <col style={{ width: colWidths.submitTime }} />
              <col style={{ width: colWidths.auditTime }} />
              <col style={{ width: colWidths.auditRemark }} />
              <col style={{ width: colWidths.supplier }} />
            </colgroup>
            <thead className="sticky top-0 z-20">
              <tr className="bg-[#e7eefe]">
                <th className="p-2 border-r border-b border-slate-200 text-center">
                  <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 accent-blue-600" />
                </th>
                <HeaderCell label="操作" onResizeStart={(e) => onResizeStart(e, 'ops')} />
                <HeaderCell label="审批流编码" onResizeStart={(e) => onResizeStart(e, 'flowId')} />
                <HeaderCell label="提报来源" onResizeStart={(e) => onResizeStart(e, 'source')} />
                <HeaderCell label="项目名称" onResizeStart={(e) => onResizeStart(e, 'project')} />
                <HeaderCell label="提报类型" onResizeStart={(e) => onResizeStart(e, 'subType')} />
                <HeaderCell label="商品信息" onResizeStart={(e) => onResizeStart(e, 'productInfo')} />
                <HeaderCell label="商品编码" onResizeStart={(e) => onResizeStart(e, 'code')} />
                <HeaderCell label="协议价 (元)" onResizeStart={(e) => onResizeStart(e, 'price')} />
                <HeaderCell label="当前状态" onResizeStart={(e) => onResizeStart(e, 'status')} />
                <HeaderCell label="审核人" onResizeStart={(e) => onResizeStart(e, 'auditor')} />
                <HeaderCell 
                  label="提报时间" 
                  sortable 
                  sortDirection={sortConfig.key === 'submitTime' ? sortConfig.direction : null}
                  onSort={() => handleSort('submitTime')}
                  onResizeStart={(e) => onResizeStart(e, 'submitTime')} 
                />
                <HeaderCell 
                  label="审核时间" 
                  sortable 
                  sortDirection={sortConfig.key === 'auditTime' ? sortConfig.direction : null}
                  onSort={() => handleSort('auditTime')}
                  onResizeStart={(e) => onResizeStart(e, 'auditTime')} 
                />
                <HeaderCell label="审核备注" onResizeStart={(e) => onResizeStart(e, 'auditRemark')} />
                <HeaderCell label="提报供应商" onResizeStart={(e) => onResizeStart(e, 'supplier')} />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {processedData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="p-3 text-center border-r border-slate-50">
                    <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 accent-blue-600" />
                  </td>
                  <td className="p-3 border-r border-slate-50 text-center">
                    <div className="flex justify-center items-center gap-4">
                      {row.status === MaterialStatus.PENDING_AUDIT && (
                        <>
                          <button className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 transition-colors">同意</button>
                          <button className="text-[11px] font-black text-red-500 hover:text-red-600 transition-colors">驳回</button>
                        </>
                      )}
                      <button onClick={() => onOpenDetail(row)} className="text-[11px] font-black text-[#2e5ef0] hover:underline transition-all">详情</button>
                    </div>
                  </td>
                  {/* 取消 ID 蓝：改为 slate-600 */}
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-600 truncate font-mono">{row.flowCode}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-black text-slate-700 text-center">{row.submissionSource}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-800 truncate">{row.projectName}</td>
                  <td className="p-3 border-r border-slate-50 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-black whitespace-nowrap">{row.submissionType}</span>
                  </td>
                  <td className="p-3 border-r border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-11 h-11 rounded-xl border border-slate-100 overflow-hidden bg-white shadow-sm ring-4 ring-slate-50/50">
                        <img src={row.imageUrl} alt="" className="w-full h-full object-contain p-1.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-black text-slate-900 truncate leading-tight">
                          <span className="text-blue-600 mr-1.5">[{row.brand}]</span> {row.name} {row.spec}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 truncate flex items-center gap-1.5">
                           <Info size={11} className="shrink-0 text-slate-300" />
                           {row.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* 取消 ID 蓝：改为 slate-700 */}
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-700 truncate font-mono">{row.code}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-black text-red-500 tabular-nums">¥{row.price.toFixed(2)}</td>
                  <td className="p-3 border-r border-slate-50 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black border-2 whitespace-nowrap shadow-sm ${getStatusStyle(row.status)}`}>
                      {getStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-800 text-center">{row.auditor || '-'}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-500 font-mono text-center">{row.submitTime}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-500 font-mono text-center">{row.auditTime}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-medium text-slate-600 truncate leading-relaxed group-hover:whitespace-normal group-hover:bg-slate-50/80 transition-all duration-300" title={row.auditRemark}>
                    {row.auditRemark || '-'}
                  </td>
                  <td className="p-3 text-[11px] text-slate-800 font-bold truncate">{row.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 现代分页栏 */}
        <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">总计数据</span>
              <span className="text-blue-600 text-sm font-black">{processedData.length}</span>
              <span className="text-slate-400">条</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              每页显示
              <select className="bg-slate-100 border-none rounded-lg px-2 py-1 text-slate-700 font-black outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
              条数据
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50 transition-all shadow-sm active:scale-95">上一页</button>
            <div className="flex items-center gap-2">
              {[1].map(p => (
                <button key={p} className={`w-9 h-9 flex items-center justify-center rounded-xl text-[12px] font-black shadow-md transition-all ${p === 1 ? 'bg-[#2e5ef0] text-white shadow-blue-500/20 scale-105' : 'bg-white text-slate-600 border border-slate-100'}`}>
                  {p}
                </button>
              ))}
            </div>
            <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderCell: React.FC<{ 
  label: string; 
  onResizeStart: (e: React.MouseEvent) => void;
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
}> = ({ label, onResizeStart, sortable, sortDirection, onSort }) => {
  return (
    <th 
      className={`p-4 border-r border-b border-slate-200 text-[11px] font-black text-slate-600 relative group text-center transition-all ${sortable ? 'cursor-pointer hover:bg-blue-100/30' : 'hover:bg-slate-50/50'}`}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="truncate tracking-wide" title={label}>{label}</span>
        {sortable && (
          <div className="flex flex-col shrink-0">
            {sortDirection === 'asc' ? (
              <ChevronUp size={14} className="text-blue-600" strokeWidth={4} />
            ) : sortDirection === 'desc' ? (
              <ChevronDown size={14} className="text-blue-600" strokeWidth={4} />
            ) : (
              <ArrowUpDown size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            )}
          </div>
        )}
      </div>
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 cursor-col-resize hover:bg-blue-400 transition-all z-30" 
        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e); }}
      />
    </th>
  );
};

const SearchItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 leading-none">{label}</label>
    <div className="relative group transition-all">
      {children}
    </div>
  </div>
);

export default MaterialList;
