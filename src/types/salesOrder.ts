import { BaseEntity, Product } from './core';
import { Dealer } from './dealer';
import { UserInfo } from './user';

export enum OrderStatusType {
  PENDING = 'PENDING',
  TM_PARTIALLY_APPROVED = 'TM_PARTIALLY_APPROVED',
  TM_APPROVED = 'TM_APPROVED',
  NLM_PARTIALLY_APPROVED = 'NLM_PARTIALLY_APPROVED',
  NLM_APPROVED = 'NLM_APPROVED',
  READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum StockReviewLineStatusType {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface SalesOrderItem extends BaseEntity {
  product: Product;
  quantity: number;
  unitPrice: number;
  discountUnitPrice: number;
  discountPrice: number;
  taxRate: number;
  taxAmount: number;
  totalPrice: number;
  status: StockReviewLineStatusType;
}

export interface SalesOrder extends BaseEntity {
  dealer: Dealer;
  orderTakenBy: UserInfo;
  orderNo: string;
  orderDate: Date;
  taxAmount: number;
  totalAmount: number;
  status: OrderStatusType;
  isSpotOrder: number;
  salesOrderItems: SalesOrderItem[];
}

export interface SalesOrderLite extends BaseEntity {
  orderNo: string;
  orderDate: Date;
  totalAmount: number;
  orderStatus: string;
  dealerId: number;
  dealerName: string;
  firmName: string;
  firstName: string;
  lastName: string;
  orderTakenById: number;
}
