export type AadhaarSide = 'front' | 'back';

export interface AadhaarScanRequest {
  imageBase64: string;
  side: AadhaarSide;
}

export interface AadhaarFrontData {
  recipientName: string;
  aadhaano: string;
}

export interface AadhaarBackData {
  address: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pinCode: string;
}

export interface AadhaarData {
  front: AadhaarFrontData;
  back: AadhaarBackData;
}