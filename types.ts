
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
  id: string;
  key: string;
  name: string;
  description: string;
  type: string;
  controlType: string;
  required: boolean;
  scope: string[];
  defaultValue: string;
  relatedField: string;
  enumValues: string;
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
