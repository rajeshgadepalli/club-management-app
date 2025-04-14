import * as yup from 'yup';
import { InferType } from 'yup';

export const paymentSchema = yup.object({
  dealer: yup
    .object({
      id: yup.number().required('Dealer is required'),
      dealerName: yup.string().optional(),
    })
    .required('Dealer is required'),

  amount: yup
    .number()
    .required('Amount is required')
    .min(0.01, 'Amount must be greater than 0'),

  paymentMethod: yup
    .object({
      id: yup.number().required('Payment method is required'),
      name: yup.string().optional(),
    })
    .required('Payment method is required'),

  notes: yup.string().optional(),
});

export type PaymentForm = InferType<typeof paymentSchema>;
