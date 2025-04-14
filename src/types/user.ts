import { BaseEntity } from './core';
import { UserRole } from './userRole';

export interface UserLite extends BaseEntity {
  firstName: string;
  lastName: string;
  userName: string;
  mobileNo: string;
  designationId: number;
  designationName: string;
  supervisorId: number;
  supervisorFirstName: string;
  supervisorLastName: string;
  hierarchyKeys: string[];
}

export interface UserInfo extends BaseEntity {
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  role: string;
  isActive: number;
}