import { useState, useCallback, useEffect } from 'react';
import { attendanceService } from '@/services/api/attendance/attendanceService';
import { Attendance } from '@/types/attendance';
import { attendanceStorage } from '@/services/storage/attendanceStorage';
import { useLoggedinUserData } from '@/hooks/api/useLoggedinUserData';

interface AttendanceState {
  todayRecord: Attendance | null;
  saving: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
}

const initialState: AttendanceState = {
  todayRecord: null,
  saving: false,
  error: null,
  message: null,
  success: false,
};

export function useAttendance() {
  const [state, setState] = useState<AttendanceState>(initialState);
  const { user } = useLoggedinUserData();

  const fetchTodayAttendance = async () => {
    if (!user?.id) return;

    try {
      // First try to get from storage
      const storedAttendance = await attendanceStorage.getAttendance();
      if (storedAttendance) {
        setState(prev => ({
          ...prev,
          todayRecord: storedAttendance,
        }));
        return;
      }

      // If not in storage, fetch from API
      const response = await attendanceService.getAttendanceByDate(user.id, new Date());
      if (response.success && response.data) {
        // Save to storage
        await attendanceStorage.saveAttendance(response.data);
        setState(prev => ({
          ...prev,
          todayRecord: response.data,
        }));
      }
    } catch (error: any) {
      // Silent fail as this is just fetching current state
    }
  };

  // Load attendance when component mounts and user is available
  useEffect(() => {
    if (user?.id) {
      fetchTodayAttendance();
    }
  }, [user?.id]);

  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      message: null,
      success: false,
    }));
  }, []);

  const markTimeIn = async (attendance: Attendance) => {
    setState(prev => ({
      ...prev,
      saving: true,
      error: null,
      success: false,
    }));

    try {
      const response = await attendanceService.markTimeIn(attendance);
      
      // Save to storage and update state
      if (response.success && response.data) {
        await attendanceStorage.saveAttendance(response.data);
        setState(prev => ({
          ...prev,
          saving: false,
          todayRecord: response.data,
          message: response.message || null,
          success: response.success,
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: error.response?.data?.message || 'Failed to mark TimeIn',
        success: false,
      }));
    }
  };

  const markTimeOut = async (attendance: Attendance) => {
    setState(prev => ({
      ...prev,
      saving: true,
      error: null,
      success: false,
    }));

    try {
      const response = await attendanceService.markTimeOut(attendance);
      
      // Save to storage and update state
      if (response.success && response.data) {
        await attendanceStorage.saveAttendance(response.data);
        setState(prev => ({
          ...prev,
          saving: false,
          todayRecord: response.data,
          message: response.message || null,
          success: response.success,
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: error.response?.data?.message || 'Failed to mark TimeOut',
        success: false,
      }));
    }
  };

  return {
    ...state,
    isTimeInPending: state.saving,
    isTimeOutPending: state.saving,
    markTimeIn,
    markTimeOut,
    resetState,
    fetchTodayAttendance,
  };
}
