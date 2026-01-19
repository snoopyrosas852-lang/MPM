
import React, { useState } from 'react';
import { 
  Search, Plus, Trash2, UserCheck, ShieldCheck, 
  Phone, ChevronRight, LayoutGrid, Briefcase, History, UserPlus
} from 'lucide-react';
import { Manager, Supplier, AuditRecord } from '../types';

const MOCK_MANAGERS: Manager[] = [
  { id: 'm1', name: '江政韬', supplierCount: 12, isReviewer: true },
  { id: 'm2', name: '计碧萍', supplierCount: 8, isReviewer: false },
  { id: 'm3', name: '张晓明', supplierCount: 5, isReviewer: false }
];

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', name: '管网新系统甲有限公司', code: 'GZ001', contact: '李四', phone: '138****8000' },
  { id: 's2', name: '管网新系统乙贸易行', code: 'GZ002', contact: '王五', phone: '139****9000' },
  { id: 's3', name: '哈尔滨元合商贸', code: 'GZ005', contact: '赵六', phone: '155****2211' }
];

const MOCK_AUDIT_LOGS: AuditRecord[] = [
  { id: '1', type: '设置审核人', person: '江政韬', detail: '设为管网新系统的审核人', time: '2025-12-08 14:00', operator: '系统管理员' },
  { id: '2', type: '取消审核人', person: '计碧萍', detail: '取消管网新系统的审核人身份', time: '2025-12-08 11:30', operator: '江政韬' },
  { id: '3', type: '配置供应商', person: '江政韬', detail: '为供应商管网新系统甲分配负责人', time: '2025-12-07 10:00', operator: '系统管理员' }
];

const ReviewerConfig: React.FC = () => {
  const [selectedManager, setSelectedManager] = useState<string | null>('m1');

  return (
    <div className="p-6 h-full flex flex-col space-y-6 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      {/* 顶部控制栏 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 p-2 rounded-xl">
             <ShieldCheck className="text-indigo-600" size={20} />
          </div>
          <div>
            <h4 className="font-black text-slate-800">审核人权限与范围配置</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">项目:</span>
              <select className="text-[10px] font-black text-indigo-600 bg-transparent outline-none">
                <option>管网新系统项目</option>
                <option>国网商城项目</option>
              </select>
            </div>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95">
          <UserPlus size={14} /> 新增人员
        </button>
      </div>

      {/* 主配置区域 */}
      <div className="grid grid-cols-12 gap-6 min-h-[400px]">
        {/* 左侧：负责人列表 */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">项目负责人 ({MOCK_MANAGERS.length})</h5>
          </div>
          {MOCK_MANAGERS.map(manager => (
            <div
              key={manager.id}
              onClick={() => setSelectedManager(manager.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                selectedManager === manager.id 
                ? 'bg-white border-blue-500 shadow-xl shadow-blue-500/10' 
                : 'bg-white border-transparent hover:border-slate-100 opacity-90'
              }`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base ${
                  selectedManager === manager.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {manager.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                    {manager.name}
                    {manager.isReviewer && <span className="bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded-full border border-emerald-100">审核人</span>}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">负责 {manager.supplierCount} 家供应商</p>
                </div>
                <div className="flex flex-col gap-1">
                   {manager.isReviewer ? (
                     <button className="text-[9px] font-bold text-red-400 hover:text-red-600">取消审核</button>
                   ) : (
                     <button className="text-[9px] font-bold text-blue-500 hover:text-blue-700">设为审核</button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 右侧：供应商分配 */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Briefcase className="text-blue-600" size={16} />
              <h5 className="font-black text-slate-700 text-xs uppercase tracking-widest">
                {MOCK_MANAGERS.find(m => m.id === selectedManager)?.name} 分配清单
              </h5>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="搜索供应商..." className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] outline-none w-48 focus:ring-2 focus:ring-blue-500/10" />
              </div>
              <button className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1 hover:bg-emerald-700">
                <Plus size={12} /> 分配供应商
              </button>
            </div>
          </div>
          
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
            {MOCK_SUPPLIERS.map(supplier => (
              <div key={supplier.id} className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group relative bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h6 className="font-bold text-slate-800 text-xs">{supplier.name}</h6>
                    <p className="text-[9px] text-slate-400 mt-1 font-mono uppercase">编码: {supplier.code}</p>
                  </div>
                  <button className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="mt-3 flex gap-4 text-[10px]">
                  <div className="flex items-center gap-1 text-slate-500">
                    <UserCheck size={12} /> {supplier.contact}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 font-mono">
                    <Phone size={12} /> {supplier.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部：操作审计记录 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <History size={16} className="text-slate-400" />
          <h5 className="font-black text-slate-700 text-xs uppercase tracking-widest">近期操作审计日志</h5>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/20">
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">操作类型</th>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">涉及人员</th>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">操作详情</th>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">时间</th>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">操作人</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_AUDIT_LOGS.map(log => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 text-[11px] font-bold text-slate-700">{log.type}</td>
                <td className="p-4 text-[11px] text-blue-600 font-bold text-center">{log.person}</td>
                <td className="p-4 text-[11px] text-slate-500">{log.detail}</td>
                <td className="p-4 text-[11px] font-mono text-slate-400 text-center">{log.time}</td>
                <td className="p-4 text-[11px] font-bold text-slate-600 text-center">{log.operator}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
           <div className="flex gap-2">
             <button className="px-3 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-400">&lt;</button>
             <button className="px-3 py-1 rounded bg-blue-600 text-white text-[10px] font-bold">1</button>
             <button className="px-3 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-400">&gt;</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerConfig;
