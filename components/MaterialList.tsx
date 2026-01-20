
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, RotateCcw, Settings2, Check, Layout, X, Info,
  ArrowUpDown, ChevronUp, ChevronDown, Filter, ChevronRight, Calendar,
  Download, FileText, Send, ShieldCheck, UserPlus, ClipboardCheck
} from 'lucide-react';
import { Material, MaterialStatus, SubmissionType, SubmissionSource } from '../types';

// 模拟数据生成器
const generateMockData = (count: number): Material[] => {
  const projects = ['管网新系统', '国网商城', '航发新系统', '南方电网B2B', '中核集团物资部'];
  const suppliers = ['咸亨国际（杭州）', '上海力特工具', '德力西电气销售部', '博世中国分销商', '中化国际贸易', '震坤行工业超市'];
  const brands = ['玛特01/MAT001', '博世/BOSCH', '世达/SATA', '公牛/BULL', '咸亨/XH'];
  const statuses = Object.values(MaterialStatus);
  const subTypes = Object.values(SubmissionType);
  const units = ['个', '件', '台', '套', '米', '卷'];

  return Array.from({ length: count }).map((_, i) => {
    const id = (i + 1).toString();
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date(2025, 1, Math.floor(Math.random() * 28) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    const dateStr = date.toISOString().replace('T', ' ').substring(0, 16);
    
    return {
      id,
      projectName: projects[Math.floor(Math.random() * projects.length)],
      imageUrl: `https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png`,
      code: `B15${Math.floor(1000000 + Math.random() * 9000000)}`,
      name: ['不锈钢法兰', '碳钢阀门', '压力表', '密封圈', '控制手柄', '绝缘手套', '多功能电表'][Math.floor(Math.random() * 7)],
      spec: `DN${Math.floor(Math.random() * 100 + 10)} PN16`,
      brand: brands[Math.floor(Math.random() * brands.length)],
      unit: units[Math.floor(Math.random() * units.length)],
      price: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
      flowCode: `PRD${Date.now().toString().slice(-6)}${i.toString().padStart(3, '0')}`,
      submissionSource: Math.random() > 0.5 ? SubmissionSource.SCP : SubmissionSource.COMMODITY_DEPT,
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      submitTime: dateStr,
      status,
      submissionType: subTypes[Math.floor(Math.random() * subTypes.length)],
      description: '基于咸亨国际真实物料管理规范生成的测试描述文字，用于验证长文本在表格中的展示效果。',
      auditTime: status === MaterialStatus.PENDING_AUDIT ? '-' : dateStr,
      auditor: ['江政韬', '计碧萍', '张晓明', '管理员'][Math.floor(Math.random() * 4)],
      auditRemark: status === MaterialStatus.REJECTED ? '附件图片清晰度不足，请重新上传' : '资料已核对'
    };
  });
};

const ALL_MOCK_DATA = generateMockData(200);

interface Props {
  onOpenReviewerConfig: () => void;
  onOpenProjectConfig: () => void;
  onOpenDetail: (material: Material) => void;
}

interface FilterOption {
  key: string;
  label: string;
  visible: boolean;
}

type SortDirection = 'asc' | 'desc' | null;
interface SortConfig {
  key: keyof Material | '';
  direction: SortDirection;
}

const MaterialList: React.FC<Props> = ({ onOpenReviewerConfig, onOpenProjectConfig, onOpenDetail }) => {
  const [activeStatus, setActiveStatus] = useState<MaterialStatus>(MaterialStatus.ALL);
  const [showFilterConfig, setShowFilterConfig] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'submitTime', direction: 'desc' });
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // 选择状态
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [colWidths, setColWidths] = useState<Record<string, number>>({
    selection: 46,
    ops: 130,
    flowId: 140,
    source: 90,
    project: 140,
    subType: 90,
    productInfo: 320,
    code: 120,
    price: 100,
    status: 110,
    auditor: 100,
    submitTime: 160,
    auditTime: 160,
    auditRemark: 220,
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
    { key: 'submitTime', label: '提报时间', visible: true },
    { key: 'auditTime', label: '审核时间', visible: true },
    { key: 'priceRange', label: '协议价范围', visible: true },
    { key: 'auditRemark', label: '审核备注', visible: true },
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

  // 数据过滤与排序
  const filteredData = useMemo(() => {
    let data = [...ALL_MOCK_DATA];
    if (activeStatus !== MaterialStatus.ALL) {
      data = data.filter(item => item.status === activeStatus);
    }
    if (sortConfig.key && sortConfig.direction) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key as keyof Material]?.toString() || '';
        const valB = b[sortConfig.key as keyof Material]?.toString() || '';
        if (valA === '-' || valA === '') return 1;
        if (valB === '-' || valB === '') return -1;
        const res = valA.localeCompare(valB, undefined, { numeric: true });
        return sortConfig.direction === 'asc' ? res : -res;
      });
    }
    return data;
  }, [activeStatus, sortConfig]);

  // 当前页数据
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(d => d.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
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
  const isFilterShown = (key: string) => {
    const visibleIndex = visibleFilters.findIndex(f => f.key === key);
    if (visibleIndex === -1) return false;
    return isFilterExpanded ? true : visibleIndex < 4;
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7fc]">
      {/* 增强型筛选面板 */}
      <div className="bg-white m-4 mb-2 rounded-xl border border-slate-200 shadow-sm p-6 relative transition-all duration-300">
        <div className="grid grid-cols-4 gap-x-8 gap-y-6 items-end">
          {isFilterShown('projectName') && (
            <SearchItem label="项目名称">
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 text-slate-700 font-bold transition-all appearance-none cursor-pointer">
                  <option value="">全部项目</option>
                  <option>管网新系统</option>
                  <option>国网商城</option>
                  <option>航发新系统</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </SearchItem>
          )}
          {isFilterShown('code') && (
            <SearchItem label="物料编码">
              <input type="text" placeholder="多个编码用逗号隔开" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-bold transition-all" />
            </SearchItem>
          )}
          {isFilterShown('name') && (
            <SearchItem label="商品名称">
              <input type="text" placeholder="请输入商品名称关键词" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-bold transition-all" />
            </SearchItem>
          )}
          {isFilterShown('submissionType') && (
            <SearchItem label="提报类型">
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-bold transition-all appearance-none cursor-pointer">
                  <option value="">全部类型</option>
                  {Object.values(SubmissionType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </SearchItem>
          )}
          {isFilterExpanded && filterOptions.map(opt => {
            if (['projectName', 'code', 'name', 'submissionType'].includes(opt.key) || !opt.visible) return null;
            return (
              <SearchItem key={opt.key} label={opt.label}>
                <input type="text" placeholder={`请输入${opt.label}`} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-bold transition-all" />
              </SearchItem>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <div className="flex gap-2 relative" ref={configRef}>
            {visibleFilters.length > 4 && (
              <button 
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#2e5ef0] rounded-lg text-xs font-black text-[#2e5ef0] hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
              >
                {isFilterExpanded ? '收起筛选' : '展开筛选'}
                {isFilterExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}

            <button 
              onClick={() => setShowFilterConfig(!showFilterConfig)}
              className={`group flex items-center gap-2 px-5 py-2.5 border rounded-lg text-xs font-black transition-all shadow-sm active:scale-95 ${showFilterConfig ? 'bg-blue-50 border-blue-500 text-blue-600 border-dashed ring-2 ring-blue-500/10' : 'bg-white border-slate-200 text-slate-600 border-dashed hover:border-blue-400 hover:text-blue-500'}`}
            >
              <Settings2 size={16} className={`${showFilterConfig ? 'rotate-90' : 'group-hover:rotate-45'} transition-transform duration-300`} />
              配置筛项
            </button>
            <button 
               onClick={() => {setCurrentPage(1); setActiveStatus(MaterialStatus.ALL);}}
               className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
            >
              <RotateCcw size={16} /> 重置
            </button>
            <button className="flex items-center gap-2 px-10 py-2.5 bg-[#2e5ef0] text-white rounded-lg text-xs font-black shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95">
              <Search size={16} /> 查询
            </button>

            {/* 配置下拉菜单 */}
            {showFilterConfig && (
              <div className="absolute right-0 top-full mt-4 w-[400px] bg-white border border-slate-200 shadow-2xl rounded-2xl z-[100] animate-in fade-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-black/10">
                <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Layout size={18} className="text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-slate-800 tracking-tight block">搜索项配置</span>
                      <span className="text-[10px] text-slate-400 font-bold">自定义您的工作台筛选字段</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="grid grid-cols-2 gap-4 max-h-[320px] overflow-y-auto custom-scrollbar pr-2">
                    {filterOptions.map(opt => (
                      <label key={opt.key} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${opt.visible ? 'bg-blue-50/40 border-blue-200 shadow-sm' : 'border-slate-100 hover:border-slate-300'}`}>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${opt.visible ? 'bg-blue-600 border-blue-600 shadow-sm' : 'bg-white border-slate-300'}`}>
                          {opt.visible && <Check size={12} className="text-white" strokeWidth={4} />}
                          <input type="checkbox" className="hidden" checked={opt.visible} onChange={() => setFilterOptions(prev => prev.map(f => f.key === opt.key ? {...f, visible: !f.visible} : f))} />
                        </div>
                        <span className={`text-[11px] font-bold ${opt.visible ? 'text-blue-700' : 'text-slate-500'}`}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
                  <button onClick={() => setShowFilterConfig(false)} className="px-8 py-2.5 bg-[#2e5ef0] text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">完成设置</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 状态切换栏 */}
      <div className="mx-4 mb-4 flex gap-1 items-center bg-slate-200/50 p-1.5 rounded-xl w-fit shadow-inner mt-2 overflow-x-auto no-scrollbar">
        {Object.values(MaterialStatus).map((s) => (
          <button
            key={s}
            onClick={() => {setActiveStatus(s); setCurrentPage(1);}}
            className={`px-6 py-2 text-xs font-black transition-all rounded-lg whitespace-nowrap ${
              activeStatus === s 
                ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5 scale-105' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
            }`}
          >
            {getStatusLabel(s)}
            {activeStatus === s && <span className="ml-1.5 text-[10px] opacity-60">({filteredData.length})</span>}
          </button>
        ))}
      </div>

      {/* 操作按钮栏 - 优化按钮组间距与新增功能按钮 */}
      <div className="mx-4 mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95 disabled:opacity-40" disabled={selectedIds.size === 0}>
            <Send size={14} /> 批量审核
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95">
            <Download size={14} /> 导出物料
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95">
            <FileText size={14} /> 导出明细
          </button>
          {/* 新增按钮：提交销售审核 */}
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-dashed border-blue-400 text-blue-600 rounded-lg text-xs font-black hover:bg-blue-50 hover:border-blue-500 transition-all shadow-sm active:scale-95 disabled:opacity-40" disabled={selectedIds.size === 0}>
            <ClipboardCheck size={14} /> 提交销售审核
          </button>
        </div>
        <div className="flex gap-3">
          <button onClick={onOpenReviewerConfig} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95">
             <ShieldCheck size={15} /> 审核人配置
          </button>
          <button onClick={onOpenProjectConfig} className="flex items-center gap-2 px-6 py-2.5 bg-[#2e5ef0] text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
             项目提报配置 <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* 数据表格主体 */}
      <div className="mx-4 mb-4 flex-1 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar relative">
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
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded-md border-slate-300 accent-blue-600 cursor-pointer" 
                    checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <HeaderCell label="操作" onResizeStart={(e) => onResizeStart(e, 'ops')} />
                <HeaderCell label="审批流编码" onResizeStart={(e) => onResizeStart(e, 'flowId')} />
                <HeaderCell label="提报来源" onResizeStart={(e) => onResizeStart(e, 'source')} />
                <HeaderCell label="项目名称" onResizeStart={(e) => onResizeStart(e, 'project')} />
                <HeaderCell label="提报类型" onResizeStart={(e) => onResizeStart(e, 'subType')} />
                <HeaderCell label="商品信息" onResizeStart={(e) => onResizeStart(e, 'productInfo')} />
                <HeaderCell label="商品编码" onResizeStart={(e) => onResizeStart(e, 'code')} />
                <HeaderCell label="协议价 (元)" onResizeStart={(e) => onResizeStart(e, 'price')} sortable sortDirection={sortConfig.key === 'price' ? sortConfig.direction : null} onSort={() => handleSort('price')} />
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
              {paginatedData.length > 0 ? paginatedData.map((row) => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-blue-50/60 transition-colors group cursor-default ${selectedIds.has(row.id) ? 'bg-blue-50/40' : ''}`}
                  onClick={() => toggleSelectRow(row.id)}
                >
                  <td className="p-3 text-center border-r border-slate-50">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded-md border-slate-300 accent-blue-600 cursor-pointer" 
                      checked={selectedIds.has(row.id)}
                      readOnly
                    />
                  </td>
                  <td className="p-3 border-r border-slate-50 text-center" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-center items-center gap-3">
                      {row.status === MaterialStatus.PENDING_AUDIT && (
                        <>
                          <button className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 hover:underline transition-all">同意</button>
                          <button className="text-[11px] font-black text-red-500 hover:text-red-600 hover:underline transition-all">驳回</button>
                        </>
                      )}
                      <button onClick={() => onOpenDetail(row)} className="text-[11px] font-black text-[#2e5ef0] hover:underline transition-all">查看</button>
                    </div>
                  </td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-500 truncate font-mono">{row.flowCode}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-black text-slate-700 text-center">{row.submissionSource}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-800 truncate">{row.projectName}</td>
                  <td className="p-3 border-r border-slate-50 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-black whitespace-nowrap">{row.submissionType}</span>
                  </td>
                  <td className="p-3 border-r border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-lg border border-slate-100 overflow-hidden bg-white shadow-sm group-hover:scale-110 transition-transform">
                        <img src={row.imageUrl} alt="" className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-black text-slate-900 truncate leading-tight">
                          <span className="text-slate-500 mr-1">[{row.brand}]</span> {row.name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate flex items-center gap-1">
                           <span className="font-medium">{row.spec}</span>
                           <span className="text-slate-200">|</span>
                           <span className="text-slate-400 opacity-60 italic">{row.description.slice(0, 20)}...</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-700 truncate font-mono">{row.code}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-black text-red-500 tabular-nums">¥{row.price.toFixed(2)}</td>
                  <td className="p-3 border-r border-slate-50 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black border shadow-sm ${getStatusStyle(row.status)}`}>
                      {getStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-800 text-center">{row.auditor || '-'}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-500 font-mono text-center">{row.submitTime}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-bold text-slate-500 font-mono text-center">{row.auditTime}</td>
                  <td className="p-3 border-r border-slate-50 text-[11px] font-medium text-slate-600 truncate leading-relaxed" title={row.auditRemark}>
                    {row.auditRemark || '-'}
                  </td>
                  <td className="p-3 text-[11px] text-slate-800 font-bold truncate">{row.supplier}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={15} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <Search size={48} />
                      <span className="text-sm font-black">未找到匹配的物料数据</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 增强型分页栏 */}
        <div className="px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">共计</span>
              <span className="text-blue-600 text-sm font-black">{filteredData.length}</span>
              <span className="text-slate-400">条记录</span>
              {selectedIds.size > 0 && (
                <div className="ml-4 px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] animate-in zoom-in-95">
                  已选 {selectedIds.size} 项
                </div>
              )}
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              每页显示
              <select 
                value={pageSize}
                onChange={(e) => {setPageSize(Number(e.target.value)); setCurrentPage(1);}}
                className="bg-slate-100 border-none rounded-lg px-2 py-1 text-slate-700 font-black outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
              >
                {[20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              条
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95"
            >
              上一页
            </button>
            <div className="flex items-center gap-1.5 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  if (pageNum < 1) pageNum = i + 1;
                }
                return (
                  <button 
                    key={pageNum} 
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-[12px] font-black transition-all ${currentPage === pageNum ? 'bg-[#2e5ef0] text-white shadow-lg shadow-blue-500/30 scale-110' : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200 hover:text-blue-500'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && <span className="text-slate-300 mx-1">...</span>}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95"
            >
              下一页
            </button>
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
        <span className="truncate tracking-wide">{label}</span>
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
  <div className="flex flex-col gap-2 relative group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] pl-1 leading-none">{label}</label>
    <div className="relative">
      {children}
    </div>
  </div>
);

export default MaterialList;
