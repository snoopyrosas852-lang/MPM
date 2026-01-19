
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

export enum SubmissionType {
  NEW = '新品提报',
  UPDATE = '资料修改',
  PRICE_CHANGE = '价格变动',
  STOP_PRODUCTION = '停产申请'
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
