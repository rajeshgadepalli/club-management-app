import { BaseEntity } from './core';

export interface UserRole extends BaseEntity {
  name: string;
  description?: string;
}