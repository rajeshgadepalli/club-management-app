import * as yup from 'yup';
import { CaseType, CaseStatus } from '@/types/courtCase';

export const courtCaseSchema = yup.object().shape({
  title: yup.string().required('Case title is required'),
  caseNumber: yup.string().required('Case number is required'),
  courtName: yup.string().required('Court name is required'),
  caseType: yup.string()
    .oneOf(Object.values(CaseType))
    .required('Case type is required'),
  filingDate: yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .required('Filing date is required'),
  nextHearingDate: yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .required('Next hearing date is required')
    .test('expiry', 'Next hearing date must be after filing date', function(value) {
      const { filingDate } = this.parent;
      if (!filingDate || !value) return true;
      return new Date(value) > new Date(filingDate);
    }),
  status: yup.string()
    .oneOf(Object.values(CaseStatus))
    .required('Status is required'),
  advocateName: yup.string().required('Advocate name is required'),
  opponentDetails: yup.string().required('Opponent details are required'),
  description: yup.string().required('Description is required'),
  remarks: yup.string(),
  attachmentUrl: yup.string(),
  associatedProducts: yup.array()
    .of(yup.string())
    .min(1, 'At least one product must be associated'),
});