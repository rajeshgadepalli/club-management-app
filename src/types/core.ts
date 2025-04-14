export interface BaseEntity {
  id: number;
}

export interface Lookup extends BaseEntity {
  category: string;
  lookupValue: string;
}

export interface LookupMap {
  [category: string]: Lookup[];
}

export enum FilterOperator {
  EQ = "eq",
  GTE = "gte",
  LTE = "lte",
  IN = "in",
  CONTAINS = "has",
}

export interface FilterField {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface LabelValue {
  label: string;
  value: string;
}

export interface Region extends BaseEntity {
  regionCode: string;
  regionName: string;
}

export interface Product extends BaseEntity {
  uniqueKey: string;
  name: string;
  productDescription: string;
  crop: string;
  segment: string;
  unitPrice: number;
  itemNumber: string;
  purchaseUnitSymbol: string;
  taxRateType: string;
  productGroupId: string;
  productNumber: string;
  gstPercent: number;
  caseQuantity: number;
  size: number;
  salesPoints: number;
  isCombo: number;
}


export interface FilterFieldsConfig {
  label: string;
  type?: string;
  options?: LabelValue[];
  value?: boolean;
  returnKey?: string;
}

export enum AreaUnitType {
  ACRE = 'ACRE',
  HECTARE = 'HECTARE',
  GUNTHA = 'GUNTHA'
}