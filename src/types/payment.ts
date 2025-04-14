import { BaseEntity, Lookup } from './core';
import { UserInfo } from './user';
import { Dealer } from './dealer';

export interface Payment extends BaseEntity {
  collectionDate: Date;
  amount: number;
  paymentMethod: Lookup;
  transactionNumber: string;
  notes?: string;
  paymentCollectedBy: UserInfo;
  dealer: Dealer;
}

export interface PaymentLite extends BaseEntity {
  uniqueKey: string;
  collectionDate: Date;
  amount: number;
  paymentMethod: string;
  tranNo: string;
  notes: string;
  orderNo: string;
  paymentCollectedById: number;
  firstName: string;
  lastName: string;
  paymentCollectedName: string;
  dealerId: number;
  dealerName: string;
}
