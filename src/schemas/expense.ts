import { ExpenseCategory, ExpenseStatus } from "@/types/expense";
import * as yup from "yup";
import { InferType } from "yup";

export const expenseSchema = yup.object({
  expenseDate: yup.date().required("Expense Date is required"),
  amount: yup.number().required("Amount is required"),
  category: yup
    .string()
    .oneOf(Object.values(ExpenseCategory))
    .required("Category is required"),
  journeyFrom: yup.string(),
  journeyTo: yup.string(),
  startTime: yup.date(),
  endTime: yup.date(),
  description: yup.string(),
  picture: yup.string(),
  location: yup.string(),
  expenseStatus: yup
    .string()
    .oneOf(Object.values(ExpenseStatus))
    .required("Expense Status is required"),
  approvalStateHead: yup.number(),
  approvalZonalManager: yup.number(),
});

export type ExpenseForm = InferType<typeof expenseSchema>;
