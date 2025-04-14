import { BaseEntity } from "./core";
import { UserInfo } from "./user";

// export type ExpenseStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ExpenseLite extends BaseEntity {
  expenseDate: Date;
  amount: number;
  category: ExpenseCategory;
  journeyFrom?: string;
  journeyTo?: string;
  startTime?: Date | undefined;
  endTime?: Date | undefined;
  description: string;
  picture?: string;
  location?: string;
  expenseStatus: ExpenseStatus;
  approvalStateHead?: number;
  approvalZonalManager?: number;
  expenseCreatedById: number;
  expenseCreatedByFirstName: string;
  expenseCreatedByLastName: string;

  expenseById: number;
  expenseCategory: ExpenseCategory;
  firstName: string;
  lastName: string;
  mobileNo: number;
}

export enum ExpenseStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ExpenseCategory {
  AUTO = "Auto",
  BIKE = "Bike",
  BUS = "Bus",
  CAR = "Car",
  DAILY_ALLOWANCES = "Daily Allowances",
  FLIGHT = "Flight",
  FUEL_EXPENSES = "Fuel Expenses",
  NIGHT_HALT = "Night Halt",
  MOBILE_RECHARGE = "Mobile Recharge",
  STATIONARY = "Stationary",
  REPAIR = "Repair",
  RIKSHAW = "Rikshaw",
  TOLL_TAX = "Toll tax",
  TRAIN = "Train",
  OTHERS = "Others",
}

export const FilteredExpOptions = [
  "Auto",
  "Bike",
  "Bus",
  "Car",
  "Flight",
  "Rikshaw",
  "Train",
  "Others",
];

export interface Expense extends BaseEntity {
  expenseBy?: UserInfo;
  expenseDate: Date;
  amount: number;
  category: ExpenseCategory | undefined;
  journeyFrom?: string;
  journeyTo?: string;
  startTime?: Date | undefined;
  endTime?: Date | undefined;
  description: string;
  picture?: string;
  location?: string;
  expenseStatus: ExpenseStatus;
  approvalStateHead?: number;
  approvalZonalManager?: number;
}
