
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, RotateCcw, Settings2, Check, Layout, X, Info,
  ArrowUpDown, ChevronUp, ChevronDown
} from 'lucide-react';
import { Material, MaterialStatus, SubmissionType, SubmissionSource } from '../types';

const MOCK_DATA: Material[] = [
  { id: '1', projectName: '管网新系统', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018369', name: '不锈钢法兰', spec: 'DN50 PN16', brand: 'MAT001', unit: '个', price: 100.00, flowCode: 'PRDDD100001', submissionSource: SubmissionSource.SCP, supplier: '管网新系统甲', submitTime: '2025-12-08 14:30', status: MaterialStatus.PENDING_AUDIT, submissionType: SubmissionType.NEW, description: '耐高压防腐蚀型测试场生成色冯绍峰撒旦法受打击考拉封闭', auditTime: '-', auditor: '江政韬', auditRemark: '待技术部核准图纸' },
  { id: '2', projectName: '国网商城', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018329', name: '碳钢阀门', spec: 'DN50 PN16', brand: 'MAT001', unit: '个', price: 100.00, flowCode: 'PRDDD100021', submissionSource: SubmissionSource.COMMODITY_DEPT, supplier: '国网商城乙', submitTime: '2025-12-08 10:15', status: MaterialStatus.PUSH_FAILED, submissionType: SubmissionType.UPDATE, description: '标准碳钢材质', auditTime: '2025-12-08 14:30', auditor: '计碧萍', auditRemark: '资料完整，推送异常，需联系ERP管理员' },
  { id: '3', projectName: '航发新系统', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018349', name: '压力表', spec: '0-1.6MPa', brand: 'MAT001', unit: '个', price: 100.00, flowCode: 'PRDDD100002', submissionSource: SubmissionSource.SCP, supplier: '航发新系统丙', submitTime: '2025-12-07 16:45', status: MaterialStatus.REJECTED, submissionType: SubmissionType.PRICE_CHANGE, description: '高精度工业级', auditTime: '2025-12-08 14:30', auditor: '张三', auditRemark: '商品图片不符合平台规范' },
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
    ops: 140,
    flowId: 140,
    source: 100,
    project: 130,
    subType: 100,
    productInfo: 320,
    code: 120,
    price: 100,
    status: 100,
    auditor: 90,
    submitTime: 160,
    auditTime: 160,
    auditRemark: 200,
    supplier: 160,
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

  const getStatusStyle = (s: MaterialStatus) => {
    switch (s) {
      case MaterialStatus.PENDING_AUDIT: return 'bg-blue-50 text-blue-600 border-blue-200';
      case MaterialStatus.APPROVED: return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case MaterialStatus.REJECTED: return 'bg-red-50 text-red-500 border-red-200';
      case MaterialStatus.PUSH_FAILED: return 'bg-orange-50 text-orange-500 border-orange-200';
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
      {/* 筛选面板 - 优化间距与对齐 */}
      <div className="bg-white m-3 mb-2 rounded border border-slate-200 shadow-sm p-5 relative">
        <div className="grid grid-cols-4 gap-x-8 gap-y-4 items-end">
          {filterOptions.find(f => f.key === 'projectName' && f.visible) && (
            <SearchItem label="项目名称">
              <select className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-slate-700 font-medium">
                <option value="">请选择项目</option>
                <option>管网新系统</option>
                <option>国网商城</option>
              </select>
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'code' && f.visible) && (
            <SearchItem label="物料编码">
              <input type="text" placeholder="多个物料编码用逗号隔开" className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'name' && f.visible) && (
            <SearchItem label="商品名称">
              <input type="text" placeholder="请输入商品名称关键词" className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'submissionType' && f.visible) && (
            <SearchItem label="提报类型">
              <select className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-medium text-slate-700">
                <option value="">全部类型</option>
                {Object.values(SubmissionType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'supplier' && f.visible) && (
            <SearchItem label="提报供应商">
              <input type="text" placeholder="请输入供应商名称" className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'auditor' && f.visible) && (
            <SearchItem label="审核人">
              <input type="text" placeholder="请输入审核人姓名" className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-medium text-slate-700" />
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'submitTime' && f.visible) && (
            <SearchItem label="提报时间">
              <input type="date" className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-slate-500 font-medium" />
            </SearchItem>
          )}
          {filterOptions.find(f => f.key === 'auditTime' && f.visible) && (
            <SearchItem label="审核时间">
              <input type="date" className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 text-slate-500 font-medium" />
            </SearchItem>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-3 relative border-t border-slate-100 pt-4">
          <div className="flex gap-2.5" ref={configRef}>
            <button 
              onClick={() => setShowFilterConfig(!showFilterConfig)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-blue-200 rounded text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Settings2 size={14} />
              配置筛项
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <RotateCcw size={14} /> 重置
            </button>
            <button className="flex items-center gap-1.5 px-7 py-1.5 bg-[#2e5ef0] text-white rounded text-[11px] font-bold shadow-md hover:bg-blue-700 transition-all">
              <Search size={14} /> 查询
            </button>

            {showFilterConfig && (
              <div className="absolute right-0 top-full mt-2 w-[340px] bg-white border border-slate-200 shadow-2xl rounded-xl z-[100] animate-in fade-in zoom-in-95 duration-200 overflow-hidden ring-4 ring-black/5">
                <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layout size={15} className="text-blue-600" />
                    <span className="text-[12px] font-black text-slate-800 tracking-tight">配置表格显示字段</span>
                  </div>
                  <button onClick={() => setShowFilterConfig(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-5 max-h-[360px] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-2 gap-2.5">
                    {filterOptions.map(opt => (
                      <label key={opt.key} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border transition-all ${opt.visible ? 'bg-blue-50/50 border-blue-200' : 'border-transparent hover:bg-slate-50'}`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${opt.visible ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                          {opt.visible && <Check size={11} className="text-white" strokeWidth={3} />}
                          <input type="checkbox" className="hidden" checked={opt.visible} onChange={() => toggleFilterVisibility(opt.key)} />
                        </div>
                        <span className={`text-[11px] font-bold ${opt.visible ? 'text-blue-700' : 'text-slate-600'}`}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400">已启用 {visibleFilters.length} 个列</span>
                  <button onClick={() => setShowFilterConfig(false)} className="px-5 py-2 bg-[#2e5ef0] text-white rounded-lg text-[11px] font-bold shadow hover:bg-blue-700 transition-all">保存设置</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 状态滑块 */}
      <div className="mx-3 mb-3 flex gap-1.5 items-center bg-slate-200/50 p-1 rounded-lg w-fit">
        {Object.values(MaterialStatus).map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-4.5 py-1.5 text-[11px] font-black transition-all rounded-md whitespace-nowrap ${
              activeStatus === s 
                ? 'bg-[#2e5ef0] text-white shadow-md' 
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            {getStatusLabel(s)}
          </button>
        ))}
      </div>

      {/* 批量操作 */}
      <div className="mx-3 mb-3 flex justify-between items-center">
        <div className="flex gap-2">
          {['批量重推', '批量审核', '提交销售审核', '导出物料', '导出明细'].map(btn => (
            <button key={btn} className="px-3.5 py-1.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
              {btn}
            </button>
          ))}
        </div>
        <div className="flex gap-2.5">
          <button onClick={onOpenReviewerConfig} className="px-4.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all">商品审核人配置</button>
          <button onClick={onOpenProjectConfig} className="px-4.5 py-1.5 bg-[#2e5ef0] text-white rounded-lg text-[11px] font-bold shadow-md hover:bg-blue-700 transition-all">项目提报配置</button>
        </div>
      </div>

      {/* 数据表格 - 优化列颜色与样式 */}
      <div className="mx-3 mb-3 flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
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
                <th className="p-2 border-r border-b border-slate-200 text-center bg-[#e7eefe]">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
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
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-3 text-center border-r border-slate-100">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  </td>
                  <td className="p-3 border-r border-slate-100 text-center">
                    <div className="flex justify-center items-center gap-3.5">
                      {row.status === MaterialStatus.PENDING_AUDIT && (
                        <>
                          <button className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 transition-colors">同意</button>
                          <button className="text-[11px] font-black text-red-500 hover:text-red-600 transition-colors">驳回</button>
                        </>
                      )}
                      <button onClick={() => onOpenDetail(row)} className="text-[11px] font-black text-[#2e5ef0] hover:text-blue-700 transition-colors">详情</button>
                    </div>
                  </td>
                  {/* 颜色优化: 去除链接蓝，改用深灰 */}
                  <td className="p-3 border-r border-slate-100 text-[11px] font-bold text-slate-900 truncate font-mono text-center">{row.flowCode}</td>
                  <td className="p-3 border-r border-slate-100 text-[11px] font-black text-slate-800 text-center">{row.submissionSource}</td>
                  <td className="p-3 border-r border-slate-100 text-[11px] font-bold text-slate-900 truncate">{row.projectName}</td>
                  <td className="p-3 border-r border-slate-100 text-center">
                    {/* 标签优化: 统一浅灰圆角 */}
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md font-bold border border-slate-200">{row.submissionType}</span>
                  </td>
                  <td className="p-3 border-r border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-lg border border-slate-100 overflow-hidden bg-white shadow-sm flex items-center justify-center p-1">
                        <img src={row.imageUrl} alt="" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-black text-slate-900 truncate leading-tight">
                          <span className="text-blue-600 mr-1">[{row.brand}]</span> {row.name} {row.spec}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 truncate flex items-center gap-1 opacity-80">
                           <Info size={10} className="shrink-0" />
                           {row.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* 颜色优化: 深灰 */}
                  <td className="p-3 border-r border-slate-100 text-[11px] font-bold text-slate-900 truncate font-mono text-center">{row.code}</td>
                  <td className="p-3 border-r border-slate-100 text-[11px] font-black text-red-600 text-right pr-4">¥{row.price.toFixed(2)}</td>
                  <td className="p-3 border-r border-slate-100 text-center">
                    {/* 状态优化: 胶囊形 Pill */}
                    <span className={`inline-block px-3.5 py-0.5 rounded-full text-[10px] font-black border whitespace-nowrap shadow-sm ${getStatusStyle(row.status)}`}>
                      {getStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="p-3 border-r border-slate-100 text-[11px] font-bold text-slate-800 text-center">{row.auditor || '-'}</td>
                  <td className="p-3 border-r border-slate-100 text-[11px] font-bold text-slate-600 font-mono text-center">{row.submitTime}</td>
                  <td className="p-3 border-r border-slate-100 text-[11px] font-bold text-slate-600 font-mono text-center">{row.auditTime}</td>
                  <td className="p-3 border-r border-slate-100 text-[11px] font-medium text-slate-500 truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:bg-white group-hover:shadow-2xl group-hover:z-10 group-hover:relative" title={row.auditRemark}>
                    {row.auditRemark || '-'}
                  </td>
                  <td className="p-3 text-[11px] text-slate-800 font-bold truncate">{row.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 分页栏 */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
          <div className="flex items-center gap-5">
            <span>共计 <span className="text-blue-600 text-[12px]">{processedData.length}</span> 条物料记录</span>
            <div className="flex items-center gap-1.5">
              每页显示
              <select className="mx-1 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-bold outline-none text-slate-700 focus:border-blue-300">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
              条
            </div>
          </div>
          <div className="flex gap-2.5 items-center">
            <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 font-bold hover:bg-slate-50 transition-all disabled:opacity-50">上一页</button>
            <div className="flex items-center gap-1.5">
              {[1].map(p => (
                <button key={p} className={`w-8.5 h-8.5 flex items-center justify-center rounded-lg text-[11px] font-black transition-all shadow-sm ${p === 1 ? 'bg-[#2e5ef0] text-white' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'}`}>
                  {p}
                </button>
              ))}
            </div>
            <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-all">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 表头单元格优化: 增加居中对齐与文字阴影，移除多余背景
const HeaderCell: React.FC<{ 
  label: string; 
  onResizeStart: (e: React.MouseEvent) => void;
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
}> = ({ label, onResizeStart, sortable, sortDirection, onSort }) => {
  return (
    <th 
      className={`p-3 border-r border-b border-slate-200 text-[11px] font-black text-slate-700 relative group transition-colors select-none ${sortable ? 'cursor-pointer hover:bg-blue-100/60' : 'hover:bg-slate-50/50'}`}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="truncate" title={label}>{label}</span>
        {sortable && (
          <div className="flex flex-col shrink-0">
            {sortDirection === 'asc' ? (
              <ChevronUp size={12} className="text-blue-600" strokeWidth={3} />
            ) : sortDirection === 'desc' ? (
              <ChevronDown size={12} className="text-blue-600" strokeWidth={3} />
            ) : (
              <ArrowUpDown size={12} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            )}
          </div>
        )}
      </div>
      <div 
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-400/50 transition-colors z-30" 
        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e); }}
      />
    </th>
  );
};

const SearchItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-0.5">{label}</label>
    <div className="relative group transition-all">
      {children}
    </div>
  </div>
);

export default MaterialList;
