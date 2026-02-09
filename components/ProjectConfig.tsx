
import React, { useState, useMemo } from 'react';
import { 
  Plus, ChevronDown, X, Info, Settings2, CheckCircle2, MoreHorizontal
} from 'lucide-react';
import { ProjectField, ProjectInfo } from '../types';

const CONTROL_TYPE_MAP: Record<string, string> = {
  '1': '单选框',
  '2': '复选框',
  '3': '下拉框',
  '4': '单行输入框'
};

const MEANING_MAP: Record<string, string> = {
  '1': '品牌',
  '2': '类目',
  '3': '协议价',
  '': '-'
};

const SUBMISSION_FIELD_TYPE_MAP: Record<string, string> = {
  '1': '客户推送',
  '2': '提报自建'
};

// 模拟标准字段库
const STANDARD_FIELDS_MOCK = [
  { key: 'material_name', name: '物料名称', desc: '物料在系统中的标准名称', controlType: '4' },
  { key: 'brand_name', name: '品牌名称', desc: '物料所属品牌', controlType: '3', fieldMeaning: '1' },
  { key: 'category_path', name: '类目路径', desc: '物料的标准分类路径', controlType: '3', fieldMeaning: '2' },
  { key: 'spec_info', name: '规格型号', desc: '物料的详细规格参数', controlType: '4' },
  { key: 'unit_code', name: '计量单位', desc: '法定的计量单位', controlType: '3' },
  { key: 'contract_price', name: '合同协议价', desc: '客户签署的生效协议价', controlType: '4', fieldMeaning: '3' },
];

const OPERATE_TYPES = [
  { value: '1', label: '推送' },
  { value: '3', label: '重推' },
  { value: '5', label: '改价' },
  { value: '2', label: '修改' },
  { value: '4', label: '上下架' }
];

const MOCK_PROJECTS: ProjectInfo[] = [
  { id: 'p1', name: '管网新系统', code: 'PLAT_001', description: '管网物料提报标准流程', fieldCount: 24 },
  { id: 'p2', name: '国网商城', code: 'PLAT_002', description: '国家电网电子商务平台', fieldCount: 18 },
  { id: 'p3', name: '航发新系统', code: 'PLAT_003', description: '航空发动机集团物资平台', fieldCount: 32 },
];

const MOCK_FIELDS: ProjectField[] = [
  {
    id: '1', platformCode: 'PLAT_001', key: 'name', name: '商品别名', desc: '推送给客户的展示名称', remark: '', required: true,
    fieldType: 'varchar', relationType: '', ruleId: '', defaultValue: '-', controlType: '4', pushType: '50', isProjectField: false,
    alias: '', hasRange: false, isContrast: false, fieldMeaning: '', relateField: '-', relateFieldEnumValue: '-', fieldEnumValue: '',
    submitOperateType: ['1', '3', '5', '2'], sort: 1, excelType: '', showSrm: true, submissionFieldType: '1'
  },
  {
    id: '2', platformCode: 'PLAT_001', key: 'custom_tag', name: '自定义标签', desc: '项目特有的标记字段', remark: '', required: false,
    fieldType: 'varchar', relationType: '', ruleId: '', defaultValue: '-', controlType: '4', pushType: '50', isProjectField: true,
    alias: '', hasRange: false, isContrast: false, fieldMeaning: '', relateField: '-', relateFieldEnumValue: '-', fieldEnumValue: '',
    submitOperateType: ['1'], sort: 2, excelType: '', showSrm: true, submissionFieldType: '2'
  }
];

interface Props {
  onBack?: () => void;
}

const ProjectConfig: React.FC<Props> = ({ onBack }) => {
  const [selectedProject, setSelectedProject] = useState('PLAT_001');
  const [fields, setFields] = useState<ProjectField[]>(MOCK_FIELDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<ProjectField | null>(null);

  const handleEditField = (field: ProjectField) => {
    setEditingField(field);
    setIsModalOpen(true);
  };

  const handleAddField = () => {
    setEditingField(null);
    setIsModalOpen(true);
  };

  const handleSave = (updated: Partial<ProjectField>) => {
    if (editingField) {
      setFields(fields.map(f => f.id === editingField.id ? { ...f, ...updated } as ProjectField : f));
    } else {
      setFields([...fields, { ...updated, id: Date.now().toString(), platformCode: selectedProject } as ProjectField]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7fc] font-['Noto_Sans_SC'] p-6 space-y-6 overflow-auto custom-scrollbar animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-[#2e5ef0] rounded-full" />
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">项目提报配置</h2>
      </div>

      <div className="bg-white rounded-lg border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-slate-600">项目名称：</label>
          <div className="relative w-72">
            <select 
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer font-bold"
            >
              {MOCK_PROJECTS.map(p => <option key={p.id} value={p.code}>{p.name} ({p.code})</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3">
        <button 
          onClick={handleAddField}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-blue-200 text-[#2e5ef0] text-xs font-bold rounded-md hover:bg-blue-50 transition-all shadow-sm"
        >
          <Plus size={14} /> 添加提报展示字段
        </button>
        <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-md hover:bg-slate-50 transition-all shadow-sm">
          审核记录
        </button>
        <button 
          onClick={onBack}
          className="px-4 py-1.5 bg-[#2e5ef0] text-white text-xs font-bold rounded-md hover:bg-blue-700 transition-all shadow-sm"
        >
          返回待推送物料列表
        </button>
      </div>

      <div className="flex items-center gap-2">
        <h3 className="text-base font-bold text-slate-800">提报字段配置</h3>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-slate-200">
                <th className="px-6 py-4 text-left text-[12px] font-bold text-slate-600">字段Key / 名称</th>
                <th className="px-6 py-4 text-left text-[12px] font-bold text-slate-600">字段描述</th>
                <th className="px-6 py-4 text-center text-[12px] font-bold text-slate-600">提报字段类型</th>
                <th className="px-6 py-4 text-center text-[12px] font-bold text-slate-600">控件类型</th>
                <th className="px-6 py-4 text-center text-[12px] font-bold text-slate-600">是否必填</th>
                <th className="px-6 py-4 text-left text-[12px] font-bold text-slate-600">提报展示范围</th>
                <th className="px-6 py-4 text-center text-[12px] font-bold text-slate-600 sticky right-0 bg-[#f8fafc]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map((field) => (
                <tr key={field.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-400 font-mono">{field.key}</span>
                      <span className="text-[13px] font-bold text-slate-800">{field.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-500 max-w-xs truncate" title={field.desc}>{field.desc || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      field.submissionFieldType === '1' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {SUBMISSION_FIELD_TYPE_MAP[field.submissionFieldType] || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-slate-600">{CONTROL_TYPE_MAP[field.controlType] || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    {field.required ? (
                      <span className="text-red-500 font-bold text-[12px]">是</span>
                    ) : (
                      <span className="text-slate-400 text-[12px]">否</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-slate-600">
                    <div className="flex flex-wrap gap-1">
                      {field.submitOperateType.map(t => (
                        <span key={t} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-bold">
                          {OPERATE_TYPES.find(o => o.value === t)?.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover:bg-slate-50 shadow-[-4px_0_8px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleEditField(field)} className="text-blue-600 text-[12px] font-bold hover:underline transition-all">编辑</button>
                      <button className="text-red-400 text-[12px] font-bold hover:underline transition-all">移除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <FieldModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          editingField={editingField}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const FieldModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Partial<ProjectField>) => void;
  editingField: ProjectField | null;
}> = ({ onClose, onSave, editingField }) => {
  const [formData, setFormData] = useState<Partial<ProjectField>>(editingField || {
    submissionFieldType: '1',
    key: '',
    name: '',
    desc: '',
    fieldMeaning: '',
    controlType: '4',
    required: true,
    defaultValue: '-',
    submitOperateType: ['1', '3', '5', '2'],
    relateField: '-',
    fieldEnumValue: '-'
  });

  // 处理字段类型切换
  const handleTypeChange = (type: '1' | '2') => {
    if (type === '2') {
      // 提报自建：清空基础信息让用户自填
      setFormData({
        ...formData,
        submissionFieldType: type,
        key: '',
        name: '',
        desc: '',
        fieldMeaning: '',
        controlType: '4'
      });
    } else {
      setFormData({ ...formData, submissionFieldType: type });
    }
  };

  // 从标准库加载已有字段
  const handleLoadStandardField = (key: string) => {
    const standard = STANDARD_FIELDS_MOCK.find(f => f.key === key);
    if (standard) {
      setFormData({
        ...formData,
        key: standard.key,
        name: standard.name,
        desc: standard.desc,
        controlType: (standard as any).controlType || '4',
        fieldMeaning: (standard as any).fieldMeaning || ''
      });
    }
  };

  const toggleOperateType = (val: string) => {
    const current = formData.submitOperateType || [];
    if (current.includes(val)) {
      setFormData({ ...formData, submitOperateType: current.filter(v => v !== val) });
    } else {
      setFormData({ ...formData, submitOperateType: [...current, val] });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 font-['Noto_Sans_SC']">
      <div className="bg-white w-full max-w-[700px] rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <Settings2 className="text-blue-600" size={18} />
            <h3 className="font-bold text-slate-800 text-[16px]">
              {editingField ? '编辑字段配置' : '新增字段配置'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6 overflow-y-auto">
          
          {/* 提报字段类型管控区 - 增加背景色区分 */}
          <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-100 space-y-4">
            <div className="grid grid-cols-2 gap-x-8">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                  提报字段类型 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={formData.submissionFieldType} 
                    onChange={e => handleTypeChange(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-blue-500 appearance-none bg-white text-[13px] font-bold"
                  >
                    {Object.entries(SUBMISSION_FIELD_TYPE_MAP).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>
              </div>

              {/* 当选择客户推送时，加载标准字段 */}
              {formData.submissionFieldType === '1' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <label className="text-[13px] font-bold text-blue-600">加载标准字段</label>
                  <div className="relative">
                    <select 
                      value={formData.key}
                      onChange={e => handleLoadStandardField(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-200 bg-blue-50/30 rounded outline-none focus:border-blue-500 appearance-none text-[13px] text-blue-700 font-medium"
                    >
                      <option value="">-- 请选择已有标准字段 --</option>
                      {STANDARD_FIELDS_MOCK.map(f => (
                        <option key={f.key} value={f.key}>{f.name} ({f.key})</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" size={14} />
                  </div>
                </div>
              )}
            </div>
            {formData.submissionFieldType === '1' && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info size={12} /> 选择标准字段后，系统将自动关联物料主数据中的核心属性。
              </p>
            )}
          </div>

          <div className="h-px bg-slate-100" />

          {/* 基础信息区 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-[13px] text-slate-700 font-medium">字段Key</label>
              <input 
                value={formData.key} 
                onChange={e => setFormData({...formData, key: e.target.value})}
                readOnly={formData.submissionFieldType === '1' && !!formData.key}
                placeholder="例如: brand_id"
                className={`w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-blue-500 transition-all text-[13px] font-mono ${formData.submissionFieldType === '1' && formData.key ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] text-slate-700 font-medium">字段名称</label>
              <input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="显示的中文标题"
                className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-blue-500 transition-all text-[13px] font-bold text-slate-800" 
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[13px] text-slate-700 font-medium">字段描述</label>
              <input 
                value={formData.desc} 
                onChange={e => setFormData({...formData, desc: e.target.value})}
                placeholder="在该项目中此字段的业务定义"
                className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-blue-500 transition-all text-[13px]" 
              />
            </div>
          </div>

          {/* 控件逻辑区 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-2">
            <div className="space-y-2">
              <label className="text-[13px] text-slate-700 font-medium">控件类型</label>
              <div className="relative">
                <select 
                  value={formData.controlType} 
                  onChange={e => setFormData({...formData, controlType: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-blue-500 appearance-none bg-white text-[13px]"
                >
                  {Object.entries(CONTROL_TYPE_MAP).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] text-slate-700 font-medium">字段含义</label>
              <div className="relative">
                <select 
                  value={formData.fieldMeaning} 
                  onChange={e => setFormData({...formData, fieldMeaning: e.target.value as any})}
                  className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-blue-500 appearance-none bg-white text-[13px]"
                >
                  <option value="">普通字段</option>
                  <option value="1">品牌 (Brand)</option>
                  <option value="2">类目 (Category)</option>
                  <option value="3">协议价 (Price)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] text-slate-700 font-medium">是否必填</label>
              <div className="relative">
                <select 
                  value={formData.required ? '是' : '否'} 
                  onChange={e => setFormData({...formData, required: e.target.value === '是'})}
                  className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-blue-500 appearance-none bg-white text-[13px] font-bold"
                >
                  <option>是</option>
                  <option>否</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] text-slate-700 font-medium">默认值</label>
              <input 
                value={formData.defaultValue} 
                onChange={e => setFormData({...formData, defaultValue: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded outline-none focus:border-blue-500 transition-all text-[13px] font-mono text-slate-500" 
              />
            </div>
          </div>

          {/* 提报范围选择 */}
          <div className="space-y-3 pt-2">
            <label className="text-[13px] font-bold text-slate-700 block">提报展示范围</label>
            <div className="flex flex-wrap gap-x-8 gap-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
              {OPERATE_TYPES.map(type => (
                <label key={type.value} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.submitOperateType?.includes(type.value)} 
                    onChange={() => toggleOperateType(type.value)}
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer shadow-sm"
                  />
                  <span className="text-[13px] font-bold text-slate-600 group-hover:text-blue-600 transition-colors">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 z-10">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded text-[13px] font-bold hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            取消
          </button>
          <button 
            onClick={() => onSave(formData)} 
            className="px-8 py-2 bg-[#2e5ef0] text-white rounded text-[13px] font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectConfig;
