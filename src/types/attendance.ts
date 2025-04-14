import { BaseEntity } from './core';
import { UserInfo } from './user';

export type AttendanceAction = 'timeIn' | 'timeOut';

export interface Attendance extends BaseEntity {
  user: UserInfo;
  attendanceDate: Date;
  timeIn?: Date;
  timeInCoordinates?: string;
  timeOut?: Date;
  timeOutCoordinates?: string;
  startOdoReading?: number;
  endOdoReading?: number;
  startPicture?: string;
  endPicture?: string;
}

export interface AttendanceState {
  todayRecord?: Attendance;
  isLoading: boolean;
  error?: string;
}
