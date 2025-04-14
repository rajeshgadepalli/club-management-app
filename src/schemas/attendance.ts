import * as yup from 'yup';

export const timeInOutSchema = yup.object().shape({
  kmReading: yup
    .number()
    .required('KM reading is required')
    .min(0, 'KM reading must be positive')
    .max(999999, 'Invalid KM reading'),
  photo: yup
    .string()
    .required('Photo is required'),
});

export type TimeInOutFormData = yup.InferType<typeof timeInOutSchema>;
