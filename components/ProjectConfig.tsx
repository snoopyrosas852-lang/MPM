
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, History, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProjectField } from '../types';

const MOCK_FIELDS: ProjectField[] = [
  {
    id: '1',
    key: 'name',
    name: '商品别名',
    description: '推送给航发的名称',
    type: '普通字符串',
    controlType: '单行输入框',
    required: true,
    scope: ['推送', '重推', '改价', '修改'],
    defaultValue: '-',
    relatedField: '-',
    enumValues: '-'
  }
];

const ProjectConfig: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState('A');

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-2 rounded-xl">
            <History className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-800">提报字段管理</h3>
            <div className="flex items-center gap-2 mt-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">当前项目:</label>
              <select 
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="text-xs font-bold text-blue-600 bg-transparent outline-none cursor-pointer"
              >
                <option value="A">管网新系统</option>
                <option value="B">国网商城</option>
                <option value="C">航发新系统</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
            <History size={14} /> 审核记录
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            <Plus size={14} /> 添加提报展示字段
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">提报字段配置列表</h4>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索字段名称..." className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/10 w-48" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">字段Key</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">字段名称</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">描述</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">类型</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">必填</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">展示范围</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">关联字段</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_FIELDS.map(field => (
                <tr key={field.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="p-4 text-xs font-mono text-blue-600 font-bold">{field.key}</td>
                  <td className="p-4 text-xs font-bold text-slate-800">{field.name}</td>
                  <td className="p-4 text-xs text-slate-500">{field.description}</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-600 rounded">
                      {field.controlType}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      {field.required ? (
                        <CheckCircle2 className="text-green-500" size={16} />
                      ) : (
                        <AlertCircle className="text-slate-300" size={16} />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {field.scope.map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold border border-blue-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-400 text-center">{field.relatedField}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectConfig;
