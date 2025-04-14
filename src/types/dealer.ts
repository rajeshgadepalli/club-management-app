import { BaseEntity, Region } from './core';
import { UserInfo } from './user';

export interface DealerLite extends BaseEntity {
  dealerCode: string;
  dealerName: string;
  firmName: string;
  dealerCreditLimit: number;
  dealerMobileNo: string;
  dealerStatus: string;
  gstinNumber: string;
  dateOfBirth: Date;
  dealerApplDate: Date;
  associatedUserId: number;
  associatedUserFirstName: string;
  associatedUserLastName: string;
  dealerCreatedById: number;
  dealerCreatedByFirstName: string;
  dealerCreatedByLastName: string;
}

export interface Dealer extends BaseEntity {
  dealerCode: string;
  dealerName: string;
  dealerMobileNo: string;
  dealerCreditLimit: number;
  firmName: string;
  firmVillage: string;
  firmMandal: string;
  firmDistrict: string;
  firmState: string;
  firmAddressPinCode: string;
  dealerApplDate: Date;
  dealerStatus: string;
  gstinNumber: string;
  dateOfBirth: Date;
  dealerCreatedDate: Date;
  dealerCreatedBy: UserInfo;
  associatedUser?: UserInfo;
  region: Region;
}
