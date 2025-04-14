import { BaseEntity } from './core';

export interface Employee extends BaseEntity {
  name: string;
  mobileNo: string;
  email: string;
  role: 'SALES_OFFICER' | 'MANAGER';
  branchName: string;
  department: string;
}
