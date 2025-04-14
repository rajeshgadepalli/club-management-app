import * as yup from 'yup';
import { InferType } from 'yup';

export const dealerSchema = yup.object({
  dealerName: yup.string().required('Dealer name is required'),
  dealerMobileNo: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  firmName: yup.string().required('Firm name is required'),
  firmVillage: yup.string().required('Village is required'),
  firmMandal: yup.string().required('Mandal is required'),
  firmDistrict: yup.string().required('District is required'),
  firmState: yup.string().required('State is required'),
  firmAddressPinCode: yup
    .string()
    .required('PIN code is required')
    .matches(/^\d{6}$/, 'PIN code must be exactly 6 digits'),
  dealerCreditLimit: yup
    .number()
    .required('Credit limit is required')
    .min(0, 'Credit limit must be positive'),
  dealerApplDate: yup.date().required('Application date is required'),
  gstinNumber: yup.string().required('GSTIN is required'),
  dateOfBirth: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),

  region: yup
    .object({
      id: yup.number().required('Region is required'),
      regionName: yup.string().optional(),
    })
    .optional()
    .nullable(),

  associatedUser: yup
    .object({
      id: yup.number().required('Associated User is required'),
      userName: yup.string().optional(),
      designationName: yup.string().optional(),
    })
    .optional()
    .nullable(),
});

export type DealerForm = InferType<typeof dealerSchema>;
