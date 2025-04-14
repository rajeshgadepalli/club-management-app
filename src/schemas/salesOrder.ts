import * as yup from 'yup';
import { InferType } from 'yup';

const productSchema = yup.object({
  id: yup.number().required('Product is required'),
  name: yup.string().optional(),
});

const salesOrderItemSchema = yup.object({
  product: productSchema.required(),
  quantity: yup
    .number()
    .required('Quantity is required')
    .min(1, 'Quantity must be at least 1'),
  unitPrice: yup
    .number()
    .required('Unit price is required')
    .min(0, 'Unit price must be positive'),
  discountUnitPrice: yup
    .number()
    .required('Discounted unit price is required')
    .min(0, 'Discounted price must be positive'),
  discountPrice: yup
    .number()
    .required('Discount price is required')
    .min(0, 'Discount must be positive'),
  taxRate: yup
    .number()
    .required('Tax rate is required')
    .min(0, 'Tax rate must be non-negative'),
  taxAmount: yup
    .number()
    .required('Tax amount is required')
    .min(0, 'Tax amount must be non-negative'),
  totalPrice: yup
    .number()
    .required('Total price is required')
    .min(0, 'Total price must be non-negative'),
});

export const salesOrderSchema = yup.object({
  orderDate: yup
    .string()
    .required('Order date is required')
    .test('valid-date', 'Order date cannot be in the future',
      value => !value || new Date(value) <= new Date()
    ),
  dealer: yup.object({
    id: yup.number().required('Dealer is required'),
    dealerName: yup.string().optional(),
  }).required('Dealer is required'),

  isSpotOrder: yup
    .number()
    .oneOf([0, 1], 'Invalid spot order value')
    .required('Is spot order field is required'),

  salesOrderItems: yup
    .array()
    .of(salesOrderItemSchema)
    .required('Sales order items are required')
    .min(1, 'At least one product must be added'),

  totalAmount: yup
    .number()
    .required('Total amount is required')
    .min(0, 'Total amount must be non-negative'),

  taxAmount: yup
    .number()
    .required('Tax amount is required')
    .min(0, 'Tax amount must be non-negative')
});

export type SalesOrderForm = InferType<typeof salesOrderSchema>;
