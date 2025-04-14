import * as yup from "yup";
import { InferType } from "yup";

export const salesReturnSchema = yup.object({
  dealer: yup
    .object({
      id: yup.number().required("Dealer is required"),
      dealerName: yup.string().optional(),
    })
    .required("Dealer is required"),

  reason: yup
    .object({
      id: yup.number().required("Reason is required"),
      lookupValue: yup.string().optional(),
    })
    .required("Reason is required"),

  returnDate: yup
    .string()
    .required("Return date is required")
    .test(
      "valid-date",
      "Return date cannot be in the future",
      (value) => !value || new Date(value) <= new Date()
    ),

  totalAmount: yup
    .number()
    .required("Total amount is required")
    .min(0, "Total amount must be non-negative"),
});

export type SalesReturnForm = InferType<typeof salesReturnSchema>;
