
import React, { useState, useMemo } from 'react';
import { 
  Search, RotateCcw, ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import { Material, MaterialStatus, SubmissionType } from '../types';

const MOCK_DATA: Material[] = [
  { id: '1', projectName: '管网新系统', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018369', name: '不锈钢法兰', spec: 'DN50 PN16', brand: 'MAT001', unit: '个', price: 100.00, flowCode: 'PRDDD100001', supplier: '管网新系统甲', submitTime: '2025-12-08 14:30', status: MaterialStatus.PENDING_AUDIT, submissionType: SubmissionType.NEW, description: '耐高压防腐蚀型', auditTime: '-', auditor: '江政韬', auditRemark: '' },
  { id: '2', projectName: '国网商城', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018329', name: '碳钢阀门', spec: 'DN50 PN16', brand: 'MAT001', unit: '个', price: 100.00, flowCode: 'PRDDD100021', supplier: '国网商城乙', submitTime: '2025-12-08 10:15', status: MaterialStatus.PUSH_FAILED, submissionType: SubmissionType.UPDATE, description: '标准碳钢材质', auditTime: '2025-12-08 14:30', auditor: '计碧萍', auditRemark: '' },
  { id: '3', projectName: '航发新系统', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018349', name: '压力表', spec: '0-1.6MPa', brand: 'MAT001', unit: '个', price: 100.00, flowCode: 'PRDDD100002', supplier: '航发新系统丙', submitTime: '2025-12-07 16:45', status: MaterialStatus.REJECTED, submissionType: SubmissionType.PRICE_CHANGE, description: '高精度工业级', auditTime: '2025-12-08 14:30', auditor: '张三', auditRemark: '资料不全' },
  { id: '4', projectName: '管网新系统', imageUrl: 'https://xhgj-xhmall-product.oss-cn-shanghai.aliyuncs.com/original/B1506018369/z1.png', code: 'B1506018388', name: '密封圈', spec: 'OD100mm', brand: 'MAT002', unit: '件', price: 12.50, flowCode: 'PRDDD100005', supplier: '中化国际', submitTime: '2025-12-09 09:00', status: MaterialStatus.PENDING_AUDIT, submissionType: SubmissionType.NEW, description: '耐油橡胶材质', auditTime: '-', auditor: '江政韬', auditRemark: '' },
];

interface Props {
  onOpenReviewerConfig: () => void;
  onOpenProjectConfig: () => void;
  onOpenDetail: (material: Material) => void;
}

type SortDirection = 'asc' | 'desc' | null;

const MaterialList: React.FC<Props> = ({ onOpenReviewerConfig, onOpenProjectConfig, onOpenDetail }) => {
  const [activeStatus, setActiveStatus] = useState<MaterialStatus>(MaterialStatus.ALL);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [filterType, setFilterType] = useState<string>('');

  const getStatusStyle = (s: MaterialStatus) => {
    switch (s) {
      case MaterialStatus.PENDING_AUDIT: return 'bg-blue-50 text-blue-600 border-blue-100';
      case MaterialStatus.APPROVED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case MaterialStatus.REJECTED: return 'bg-red-50 text-red-500 border-red-100';
      case MaterialStatus.PUSH_FAILED: return 'bg-orange-50 text-orange-600 border-orange-100';
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

  const toggleSort = () => {
    if (sortDir === null) setSortDir('desc');
    else if (sortDir === 'desc') setSortDir('asc');
    else setSortDir(null);
  };

  const processedData = useMemo(() => {
    let data = [...MOCK_DATA];
    
    // 状态过滤
    if (activeStatus !== MaterialStatus.ALL) {
      data = data.filter(item => item.status === activeStatus);
    }

    // 排序逻辑
    if (sortDir) {
      data.sort((a, b) => {
        const timeA = new Date(a.submitTime).getTime();
        const timeB = new Date(b.submitTime).getTime();
        return sortDir === 'asc' ? timeA - timeB : timeB - timeA;
      });
    }

    return data;
  }, [activeStatus, sortDir]);

  const renderOperations = (row: Material) => {
    if (row.status === MaterialStatus.PENDING_AUDIT) {
      return (
        <div className="flex justify-center gap-3">
          <button className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 hover:underline">同意</button>
          <button className="text-[11px] font-black text-red-500 hover:text-red-700 hover:underline">驳回</button>
          <button onClick={() => onOpenDetail(row)} className="text-[11px] font-black text-blue-600 hover:text-blue-800 hover:underline">详情</button>
        </div>
      );
    } else if (row.status === MaterialStatus.PUSH_FAILED) {
      return (
        <div className="flex justify-center gap-3">
          <button className="text-[11px] font-black text-blue-600 hover:text-blue-700 hover:underline">重新推送</button>
          <button onClick={() => onOpenDetail(row)} className="text-[11px] font-black text-blue-600 hover:text-blue-800 hover:underline">详情</button>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center gap-3">
          <button onClick={() => onOpenDetail(row)} className="text-[11px] font-black text-blue-600 hover:text-blue-800 hover:underline">详情</button>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 筛选面板 */}
      <div className="bg-white m-3 rounded-lg border border-slate-200 shadow-sm p-4">
        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">项目名称</label>
            <select className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500 transition-all">
              <option value="">请选择项目</option>
              <option>管网新系统</option>
              <option>国网商城</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">物料编码</label>
            <input type="text" placeholder="多个编码请用逗号分隔" className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">商品名称</label>
            <input type="text" placeholder="请输入商品名称关键词" className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">提报类型</label>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="">全部类型</option>
              {Object.values(SubmissionType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-[11px] font-black text-blue-600 flex items-center gap-1 hover:underline">
            {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            {isExpanded ? '收起更多筛选' : '展开更多筛选'}
          </button>
          <div className="flex gap-2">
            <button className="px-5 py-1.5 border border-slate-200 rounded-md text-[11px] font-black text-slate-600 hover:bg-slate-50 flex items-center gap-1 transition-all">
              <RotateCcw size={14} /> 重置
            </button>
            <button className="px-7 py-1.5 bg-[#2e5ef0] text-white rounded-md text-[11px] font-black shadow-lg shadow-blue-500/10 hover:bg-blue-700 flex items-center gap-1 transition-all">
              <Search size={14} /> 查询
            </button>
          </div>
        </div>
      </div>

      {/* 状态滑块 */}
      <div className="mx-3 mb-3 bg-white px-2 py-1.5 rounded-lg border border-slate-200 shadow-sm flex gap-1 items-center overflow-x-auto no-scrollbar">
        {Object.values(MaterialStatus).map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-4 py-1.5 rounded-md text-[11px] font-black whitespace-nowrap transition-all ${
              activeStatus === s ? 'bg-[#2e5ef0] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {getStatusLabel(s)}
          </button>
        ))}
      </div>

      {/* 工具栏 */}
      <div className="mx-3 mb-3 flex justify-between items-center">
        <div className="flex gap-1.5">
          {['批量重推', '批量审核', '提交销售审核', '提报明细导出'].map(btn => (
            <button key={btn} className="px-3 py-1.5 bg-white border border-blue-200 rounded text-[11px] font-black text-blue-600 hover:bg-blue-50 transition-all">
              {btn}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onOpenReviewerConfig} className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 rounded text-[11px] font-black shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all">商品审核人配置</button>
          <button onClick={onOpenProjectConfig} className="px-4 py-1.5 bg-[#2e5ef0] text-white rounded text-[11px] font-black shadow shadow-blue-200 hover:bg-blue-700 transition-all">项目提报配置</button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="mx-3 flex-1 bg-white border border-slate-200 rounded-t-lg shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full border-collapse table-fixed min-w-[1900px]">
            <thead className="sticky top-0 z-20">
              <tr className="bg-[#e7eefe]">
                <th className="p-3 w-[50px] text-center border-r border-b border-slate-200"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /></th>
                <th className="p-3 w-[150px] text-center border-r border-b border-slate-200 text-[11px] font-black text-slate-700">操作</th>
                <th className="p-3 w-[150px] text-left border-r border-b border-slate-200 text-[11px] font-black text-slate-700">项目名称</th>
                <th className="p-3 w-[100px] text-center border-r border-b border-slate-200 text-[11px] font-black text-slate-700">提报类型</th>
                <th className="p-3 w-[100px] text-center border-r border-b border-slate-200 text-[11px] font-black text-slate-700">图片预览</th>
                <th className="p-3 w-[450px] text-left border-r border-b border-slate-200 text-[11px] font-black text-slate-700">商品标题 (品牌/名称/型号/描述)</th>
                <th className="p-3 w-[140px] text-left border-r border-b border-slate-200 text-[11px] font-black text-slate-700">商品编码</th>
                <th className="p-3 w-[120px] text-left border-r border-b border-slate-200 text-[11px] font-black text-slate-700">协议价 (元)</th>
                <th className="p-3 w-[150px] text-left border-r border-b border-slate-200 text-[11px] font-black text-slate-700">当前状态</th>
                <th className="p-3 w-[220px] text-left border-r border-b border-slate-200 text-[11px] font-black text-slate-700">提报供应商</th>
                <th 
                  className="p-3 w-[180px] text-left border-r border-b border-slate-200 text-[11px] font-black text-slate-700 cursor-pointer group hover:bg-blue-100/50 transition-all"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-2 justify-between">
                    提报时间
                    <span className={sortDir ? 'text-blue-600' : 'text-slate-400 opacity-0 group-hover:opacity-100'}>
                      {sortDir === 'asc' ? <ArrowUp size={14}/> : sortDir === 'desc' ? <ArrowDown size={14}/> : <ArrowUpDown size={14}/>}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="p-3 text-center border-r border-slate-100"><input type="checkbox" className="rounded" /></td>
                  <td className="p-3 border-r border-slate-100 text-center">
                    {renderOperations(row)}
                  </td>
                  <td className="p-3 border-r border-slate-100 text-[11px] font-medium text-slate-700">{row.projectName}</td>
                  <td className="p-3 border-r border-slate-100 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-bold">{row.submissionType}</span>
                  </td>
                  <td className="p-3 border-r border-slate-100 text-center">
                    <div className="inline-block w-12 h-12 rounded border border-slate-200 overflow-hidden bg-white p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                      <img src={row.imageUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                  </td>
                  <td className="p-3 border-r border-slate-100">
                    <div className="text-[11px] font-black text-slate-900 leading-snug">
                      <span className="text-blue-600 mr-1">[{row.brand}]</span> 
                      {row.name} {row.spec}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      描述 {row.description}
                    </div>
                  </td>
                  <td className="p-3 border-r border-slate-100 text-[11px] font-bold text-blue-600">{row.code}</td>
                  <td className="p-3 border-r border-slate-100 text-[11px] font-black text-slate-800">¥{row.price.toFixed(2)}</td>
                  <td className="p-3 border-r border-slate-100 text-center">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black border ${getStatusStyle(row.status)} shadow-sm`}>
                      {getStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="p-3 border-r border-slate-100 text-[11px] text-slate-600 font-medium truncate">{row.supplier}</td>
                  <td className={`p-3 border-r border-slate-100 text-[10px] font-medium ${sortDir ? 'text-blue-700 bg-blue-50/20' : 'text-slate-400'}`}>{row.submitTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-100 bg-white flex items-center justify-between text-[11px] font-bold text-slate-500">
          <div>共 {processedData.length} 条记录</div>
          <div className="flex gap-2 items-center">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-400 hover:bg-slate-50">上一页</button>
            <div className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded text-[11px]">1</div>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-400 hover:bg-slate-50">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialList;
