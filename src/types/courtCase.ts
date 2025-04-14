export interface CourtCase {
  id: string;
  title: string;
  caseNumber: string;
  courtName: string;
  caseType: CaseType;
  filingDate: string;
  nextHearingDate: string;
  status: CaseStatus;
  advocateName: string;
  opponentDetails: string;
  description: string;
  remarks: string;
  attachmentUrl?: string;
}

export enum CaseType {
  CIVIL = 'Civil',
  CRIMINAL = 'Criminal',
  INDUSTRIAL = 'Industrial',
  OTHER = 'Other'
}

export enum CaseStatus {
  PENDING = 'Pending',
  ONGOING = 'Ongoing',
  CLOSED = 'Closed'
}