import { BaseEntity } from "./core";

export interface GeoLocation {
  address: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pinCode: string;
}

export interface PinCodeDirectory extends BaseEntity {
  village: string;
  poName: string;
  pinCode: string;
  subDistrict: string;
  district: string;
  state: string;
}
