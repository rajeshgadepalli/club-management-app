import { BaseEntity } from "./core";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserAccess {
  privileges: string[];
  features: string[];
  modules: string[];
}

export interface User extends BaseEntity{
  firstName: string;
  lastName: string;
  designation: string;
  roleKey: string;
  mobileNo: string;
  email?: string;
  access: UserAccess;
}

export interface Agent extends BaseEntity{
  designation: string;
}