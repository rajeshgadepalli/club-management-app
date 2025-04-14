import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Button, Text, TextInput } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import { COLORS, SPACING } from '@/theme';
import { useAttendanceForm } from '@/hooks/attendance/form/useAttendanceForm';
import { AttendanceAction } from '@/types/attendance';
import ImagePreview from '@/components/common/ImagePreview';
import CustomCamera from '@/components/camera/CustomCamera';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingButton from '@/components/common/LoadingButton';
import SuccessAlert from '@/components/common/SuccessAlert';
import { appStyles } from '@/theme/styles.new';
import { useAttendance } from '@/hooks/attendance/api/useAttendance';
import { formatTime } from '@/utils/dateUtils';

interface TimeInOutModalProps {
  visible: boolean;
  onDismiss: () => void;
  action: AttendanceAction;
}

export default function TimeInOutModal({
  visible,
  onDismiss,
  action,
}: TimeInOutModalProps) {
  const { todayRecord } = useAttendance();
  const {
    form: { control, formState: { errors } },
    camera: { showCamera, imageUri, openCamera, handleCapture, closeCamera },
    handleSubmit,
    handleRemovePhoto,
    saving,
    error,
    clearError,
    success,
    message
  } = useAttendanceForm({
    action
  });

  const title = action === 'timeIn' ? 'Time In' : 'Time Out';

  const handleSuccessClose = () => {
    clearError();
    onDismiss();
  };

  const renderAttendanceInfo = () => {
    if (!todayRecord) return null;

    if (action === 'timeIn' && todayRecord.timeIn) {
      return (
        <View style={styles.infoContainer}>
          <Text variant="titleMedium">Today's Time In</Text>
          <Text variant="bodyLarge" style={styles.timeText}>
            {formatTime(new Date(todayRecord.timeIn))}
          </Text>
          <Text variant="bodyMedium">
            KM Reading: {todayRecord.startOdoReading}
          </Text>
        </View>
      );
    }

    if (action === 'timeOut' && todayRecord.timeOut) {
      return (
        <View style={styles.infoContainer}>
          <Text variant="titleMedium">Today's Time Out</Text>
          <Text variant="bodyLarge" style={styles.timeText}>
            {formatTime(new Date(todayRecord.timeOut))}
          </Text>
          <Text variant="bodyMedium">
            KM Reading: {todayRecord.endOdoReading}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <Portal>
      {showCamera ? (
        <CustomCamera
          onCapture={handleCapture}
          onClose={closeCamera}
        />
      ) : (
        <>
          <Modal
            visible={visible && !success}
            onDismiss={onDismiss}
            contentContainerStyle={styles.container}
          >
            {error ? (
              <ErrorMessage
                message={error}
                onRetry={() => clearError()}
              />
            ) : (
              <>
                <Text variant="titleLarge" style={styles.title}>{title}</Text>

                {renderAttendanceInfo()}

                {(!todayRecord?.timeIn && action === 'timeIn') || (!todayRecord?.timeOut && action === 'timeOut') ? (
                  <>
                    <Controller
                      control={control}
                      name="kmReading"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          label="KM Reading"
                          keyboardType="numeric"
                          value={value?.toString() || ''}
                          onChangeText={text => onChange(parseInt(text) || 0)}
                          error={!!errors.kmReading}
                          style={styles.input}
                        />
                      )}
                    />
                    {errors.kmReading && (
                      <Text style={styles.errorText}>{errors.kmReading.message}</Text>
                    )}

                    {imageUri ? (
                      <View style={styles.imageContainer}>
                        <ImagePreview uri={imageUri} onRemove={handleRemovePhoto} />
                      </View>
                    ) : (
                      <Button
                        mode="outlined"
                        onPress={openCamera}
                        style={styles.cameraButton}
                      >
                        Take Photo
                      </Button>
                    )}

                    <View style={styles.buttonContainer}>
                      <Button
                        mode="outlined"
                        onPress={onDismiss}
                      >
                        Cancel
                      </Button>
                      <LoadingButton
                        mode="contained"
                        onPress={handleSubmit}
                        loading={saving}
                      >
                        Submit
                      </LoadingButton>
                    </View>
                  </>
                ) : (
                  <Button
                    mode="outlined"
                    onPress={onDismiss}
                  >
                    Close
                  </Button>
                )}
              </>
            )}
          </Modal>

          <SuccessAlert
            visible={success}
            message={message || 'Attendance marked successfully'}
            onDismiss={handleSuccessClose}
          />
        </>
      )}
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    margin: SPACING.lg,
    borderRadius: 8,
  },
  title: {
    marginBottom: SPACING.md,
  },
  input: {
    marginBottom: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  cameraButton: {
    marginTop: SPACING.md,
  },
  imageContainer: {
    marginTop: SPACING.md,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  timeText: {
    color: COLORS.primary,
    marginVertical: SPACING.xs,
  },
  closeButton: {
    marginTop: SPACING.md,
  }
});
