export enum FilterFieldLabelValue {
  BRANCHLABEL = "Branch",
  ROUTELABEL = "Route",
  DATE_DROPDOWN = "Date Dropdown",
  STATUS = "Status",
}

export enum FilterFieldType {
  DROPDOWNTYPE = "dropdown",
}

export enum FilterReturnType {
  BRANCH_KEY = "branchKey",
  ROUTE_KEY = "routeKey",
  DATE_DROPDOWN_DEALER_KEY = "dateOfBirth",
  DATE_DROPDOWN_SALES_ORDER_KEY = "orderDate",
  DATE_DROPDOWN_DELIVERY_KEY = "plannedDeliveryDate",
  DATE_DROPDOWN_PAYMENT_KEY = "collectionDate",
  DATE_DROPDOWN_EXPENSE_KEY = "expenseDate",
  DATE_DROPDOWN_UNPLANNED_ACTIVITY_KEY = "activityDate",
}

export enum FilterOperator {
  EQ = "eq",
  GTE = "gte",
  LTE = "lte",
}

export interface FilterField {
  field: FilterReturnType | string;
  operator: FilterOperator;
  value: any;
}
