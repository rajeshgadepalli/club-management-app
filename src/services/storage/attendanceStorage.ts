import AsyncStorage from '@react-native-async-storage/async-storage';
import { Attendance } from '@/types/attendance';
import { STORAGE_KEYS } from '@/constants/storage';
import { isSameDay } from '@/utils/dateUtils';

export const attendanceStorage = {
  async saveAttendance(attendance: Attendance): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TODAY_ATTENDANCE, JSON.stringify(attendance)],
        [STORAGE_KEYS.ATTENDANCE_SYNC_DATE, new Date().toISOString()]
      ]);
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  },

  async getAttendance(): Promise<Attendance | null> {
    try {
      const [attendanceData, syncDate] = await AsyncStorage.multiGet([
        STORAGE_KEYS.TODAY_ATTENDANCE,
        STORAGE_KEYS.ATTENDANCE_SYNC_DATE
      ]);

      // If no sync date or attendance data, return null
      if (!syncDate[1] || !attendanceData[1]) {
        return null;
      }

      // Check if the stored attendance is from today
      if (!isSameDay(new Date(syncDate[1]), new Date())) {
        await this.clearAttendance();
        return null;
      }

      return JSON.parse(attendanceData[1]) as Attendance;
    } catch (error) {
      console.error('Error getting attendance:', error);
      return null;
    }
  },

  async clearAttendance(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TODAY_ATTENDANCE,
        STORAGE_KEYS.ATTENDANCE_SYNC_DATE
      ]);
    } catch (error) {
      console.error('Error clearing attendance:', error);
    }
  }
};
