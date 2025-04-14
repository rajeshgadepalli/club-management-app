import * as yup from "yup";
import { InferType } from "yup";

export const unplannedActivitySchema = yup.object({
  activityDate: yup.date().required("Activity date is required"),

  fromTime: yup.date().required("From time is required"),

  toTime: yup
    .date()
    .required("To time is required")
    .min(yup.ref("fromTime"), "To time must be after from time"),

  categoryId: yup.number().required("Category is required"),

  comments: yup.string().optional(),

  picture: yup.string().optional(),

  subordinateUser: yup
    .object({
      id: yup.number().required("Subordinate user is required"),
      userName: yup.string().optional(),
      designationName: yup.string().optional(),
    })
    .nullable()
    .optional(),
});

export type UnplannedActivityForm = InferType<typeof unplannedActivitySchema>;
