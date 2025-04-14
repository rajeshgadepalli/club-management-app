import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCustomCamera } from '@/hooks/useCustomCamera';
import React, { useCallback, useState, useEffect } from 'react';
import { useLoggedinUserData } from '@/hooks/api/useLoggedinUserData';
import { AttendanceAction, Attendance } from '@/types/attendance';
import { UserInfo } from '@/types/user';
import { useAttendance } from '../api/useAttendance';
import { useFileUpload } from "@/hooks/api/useFileUpload";

const schema = yup.object({
  kmReading: yup.number().min(0, 'KM reading must be greater than 0'),
  photo: yup.string().required('Photo is required'),
});

type FormData = yup.InferType<typeof schema>;

interface UseAttendanceFormProps {
  action: AttendanceAction;
}

export const useAttendanceForm = ({ action }: UseAttendanceFormProps) => {
  const { user } = useLoggedinUserData();
  const { markTimeIn, markTimeOut, error, saving, resetState, success, message } = useAttendance();
  const { uploadBinaryImage } = useFileUpload();

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      kmReading: 0,
      photo: '',
    },
  });

  const camera = useCustomCamera();

  // When the image URI changes in the camera, update the form
  useEffect(() => {
    if (camera.imageUri) {
      form.setValue('photo', camera.imageUri);
    }
  }, [camera.imageUri]);

  // Reset form and camera when submission is successful
  useEffect(() => {
    if (success) {
      form.reset();
      camera.setImageUri(null);
    }
  }, [success]);

  const handleRemovePhoto = () => {
    form.setValue('photo', '');
    camera.setImageUri(null);
  };

  const handleSubmit = async (data: FormData) => {
    if (!user) return;

    const attendanceData: Partial<Attendance> = {
      user: {
        id: user.id,
      } as UserInfo,
      attendanceDate: new Date(),
    };
    let uploadedUrl = data.photo;
    if (data.photo && !data.photo.startsWith("http")) {
      uploadedUrl = await uploadBinaryImage(data.photo);
    }

    if (action === 'timeIn') {
      attendanceData.timeIn = new Date();
      attendanceData.startOdoReading = data.kmReading;
      attendanceData.startPicture = uploadedUrl;
      markTimeIn(attendanceData as Attendance);
    } else {
      attendanceData.timeOut = new Date();
      attendanceData.endOdoReading = data.kmReading;
      attendanceData.endPicture = uploadedUrl;
      markTimeOut(attendanceData as Attendance);
    }
  };

  const clearError = useCallback(() => {
    resetState();
  }, [resetState]);

  return {
    form,
    camera,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleRemovePhoto,
    error,
    saving,
    success,
    message,
    clearError
  };
};
