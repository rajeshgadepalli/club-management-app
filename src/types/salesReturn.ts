// // types/salesReturn.ts

// import { BaseEntity } from "./core";
// import { Dealer } from "./dealer";
// import { UserInfo } from "./user";
// import { Lookup } from "./core";

// export interface SalesReturn extends BaseEntity {
//   dealer: Dealer;
//   returnTakenBy: UserInfo;
//   reason: Lookup;

//   returnNo: string;
//   returnDate: Date;
//   totalAmount: number;
// }

// export interface SalesReturnLite extends BaseEntity {
//   returnNo: string;
//   returnDate: string;
//   totalAmount: number;

//   dealerId: number;
//   dealerName: string;

//   returnTakenById: number;
//   returnTakenByFirstName: string;
//   returnTakenByLastName: string;

//   reasonId: number;
//   reasonName: string;
// }

// types/salesReturn.ts
import { BaseEntity, Lookup, Product } from "./core";
import { Dealer } from "./dealer";
import { UserInfo } from "./user";

export interface SalesReturnItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  totalAmountWithTax: number;
}

export interface SalesReturn extends BaseEntity {
  dealer: Dealer;
  returnTakenBy: UserInfo;
  reason: Lookup;
  returnNo: string;
  returnDate: Date;
  totalAmount: number;
  salesReturnItems: SalesReturnItem[]; // ✅ Add this
}
