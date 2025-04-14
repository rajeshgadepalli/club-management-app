// // models/unplanned-activity.ts

// import { BaseEntity, Lookup } from "./core";
// import { UserInfo } from "./user";

// export interface UnplannedActivity extends BaseEntity {
//   user: { id: number };
//   activityDate: Date;
//   fromTime: Date;
//   toTime: Date;
//   category: { id: number };
//   subordinateUser?: { id: number };
//   comments?: string;
//   picture?: string;
// }

// export interface UnplannedActivityLite extends BaseEntity {
//   user: {
//     id: number;
//     firstName: string;
//     lastName: string;
//   };
//   activityDate: Date;
//   fromTime: Date;
//   toTime: Date;
//   category: {
//     id: number;
//     name: string;
//   };
//   subordinateUser?: {
//     id: number;
//     firstName?: string;
//     lastName?: string;
//   };
//   comments?: string;
//   picture?: string;
// }

import { BaseEntity, Lookup } from "./core";
import { UserInfo } from "./user";

export interface UnplannedActivity extends BaseEntity {
  userId: number;
  user?: UserInfo;

  activityDate: Date;
  fromTime: Date;
  toTime: Date;

  categoryId: number;
  category?: Lookup;

  subordinateUser?: UserInfo;

  comments?: string;
  picture?: string;
}

export interface UnplannedActivityLite extends BaseEntity {
  activityDate: Date;
  fromTime: Date;
  toTime: Date;

  categoryId: number;
  categoryName: string;

  userId: number;
  firstName: string;
  lastName: string;
  mobileNo: string;

  subordinateUserId?: number;
  subordinateUserFirstName?: string;
  subordinateUserLastName?: string;
  subordinateUserMobileNo?: string;

  comments?: string;
  picture?: string;
}
