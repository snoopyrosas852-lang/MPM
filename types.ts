
export enum MaterialStatus {
  ALL = 'ALL',
  PENDING_AUDIT = 'PENDING_AUDIT',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  PUSHED = 'PUSHED',
  PUSH_FAILED = 'PUSH_FAILED',
  PENDING_SALES_AUDIT = 'PENDING_SALES_AUDIT',
  SALES_AUDITING = 'SALES_AUDITING'
}

export enum SubmissionSource {
  SCP = 'SCP',
  COMMODITY_DEPT = '商品管理部'
}

export enum SubmissionType {
  NEW = '商品新增',
  UPDATE = '商品修改',
  PRICE_CHANGE = '价格更新',
  RE_PUSH = '商品重推'
}

export interface Material {
  id: string;
  projectName: string;
  imageUrl: string;
  code: string;
  name: string;
  spec: string;
  brand: string;
  unit: string;
  price: number;
  flowCode: string;
  submissionSource: SubmissionSource;
  supplier: string;
  submitTime: string;
  status: MaterialStatus;
  submissionType: SubmissionType;
  description: string;
  auditTime: string;
  auditor: string;
  auditRemark: string;
}

export interface ProjectField {
  id: string; // 序号
  platformCode: string; // c_platform_code (平台编码)
  key: string; // c_key (字段 key)
  name: string; // c_name (字段名)
  desc: string; // c_desc (字段描述)
  remark: string; // c_remark (字段备注)
  required: boolean; // c_required (是否必填)
  fieldType: string; // c_field_type (字段类型)
  relationType: string; // c_relation_type (关联类型)
  ruleId: string; // c_rule_id (规则 id)
  defaultValue: string; // c_default_value (默认值)
  controlType: '1' | '2' | '3' | '4'; // c_control_type (前端显示控件类型, 1: 单选框 2: 复选框 3: 下拉框 4: 文本框)
  pushType: string; // c_push_type (字段属于哪种类型的字段)
  isProjectField: boolean; // c_project_field (是否是项目型字段)
  alias: string; // c_alias (字段属于哪种类型的字段)
  hasRange: boolean; // c_range (是否有范围校验)
  isContrast: boolean; // c_contrast (推送时是否进行比较)
  fieldMeaning: '1' | '2' | '3' | ''; // c_field_meaning (字段含义, 1: 品牌 2: 类目 3: 协议价)
  relateField: string; // c_relate_field (关联字段)
  relateFieldEnumValue: string; // c_relate_field_enum_value (关联字段枚举值)
  fieldEnumValue: string; // c_field_enum_value (字段枚举值)
  submitOperateType: string[]; // c_submit_operate_type (提报操作类型: 1: 新增 2: 修改 3: 重推 4: 上下架 5: 价格更新)
  sort: number; // c_sort (用于展示、和生成excel的排序)
  excelType: string; // c_excel_type (生成excel的类型)
  showSrm: boolean; // c_show_srm (是否在 srm 展示)
  submissionFieldType: '1' | '2'; // 提报字段类型: 1: 客户推送 2: 提报自建
}

export interface ProjectInfo {
  id: string;
  name: string;
  code: string;
  description: string;
  fieldCount: number;
}

export interface Manager {
  id: string;
  name: string;
  supplierCount: number;
  isReviewer?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contact: string;
  phone: string;
}

export interface AuditRecord {
  id: string;
  type: string;
  detail: string;
  time: string;
  operator: string;
  person?: string;
}
