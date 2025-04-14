import { BaseEntity, Product } from './core';
import { SalesOrder, SalesOrderItem } from './salesOrder';
import { UserInfo } from './user';
import { Payment } from './payment';

export enum DeliveryItemStatusType {
  DELIVERED = 'DELIVERED',
  FULL_RETURN = 'FULL_RETURN',
  PARTIALLY_DELIVERED = 'PARTIALLY_DELIVERED'
}

export enum DeliveryStatusType {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  PARTIALLY_DELIVERED = 'PARTIALLY_DELIVERED',
  FULL_RETURN = 'FULL_RETURN',
  DELIVERY_VERIFIED = 'DELIVERY_VERIFIED',
  DELIVERY_VERIFICATION_FAILED = 'DELIVERY_VERIFICATION_FAILED'
}

export interface DeliveryLite extends BaseEntity {
  deliveryUniqueKey: string;
  plannedDeliveryDate: Date;
  ewayBillNo?: string;
  deliveryStatus: string;
  deliverTo: string;
  deliveryAddress: string;
  actualDeliveryDate?: Date;
  firstName: string;
  lastName: string;
  deliveredBy?: string;
  orderNo: string;
  stockPointName?: string;
}

export interface DeliveryItem extends BaseEntity {
  delivery?: Delivery;
  product: Product;
  unitPrice: number;
  salesOrderItem: SalesOrderItem;
  quantityOrdered: number;
  quantityDelivered: number;
  quantityReturned: number;
  deliveryItemStatus: DeliveryItemStatusType;
  refundAmount: number;
  pointsEarned: number;
}

export interface Delivery extends BaseEntity {
  salesOrder: SalesOrder;
  deliveryCreatedBy: UserInfo;
  vehicle?: any;
  stockPoint?: any;
  deliveryOwner?: UserInfo;
  eWayBillNo?: string;
  plannedDeliveryDate: Date;
  deliveryStatus: DeliveryStatusType;
  deliverTo: string;
  deliveryAddress: string;
  deliveredBy?: UserInfo;
  actualDeliveryDate?: Date;
  refundAmount: number;
  totalPointsEarned: number;
  deliveryItems: DeliveryItem[];
  payment?: Payment;
  paymentCollections?: Payment[];
}
