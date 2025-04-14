import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import CustomCamera from '@/components/camera/CustomCamera';
import ImagePreview from '@/components/common/ImagePreview';
import SuccessAlert from '@/components/common/SuccessAlert';
import { useAadhaarForm } from '@/hooks/dealers/form/useAadhaarForm';
import { appStyles } from '@/theme/styles.new';

export default function AadhaarVerification() {
  const {
    control,
    errors,
    frontImage,
    backImage,
    handleSubmit,
    onSubmit,
    handleSkip,
    openCameraFor,
    closeCamera,
    handleCapture,
    handleRemoveImage,
    showCamera,
    cameraTarget,
    success,
    setSuccess,
    handleSuccessDismiss
  } = useAadhaarForm();

  if (showCamera && cameraTarget) {
    return (
      <CustomCamera
        onCapture={handleCapture}
        onClose={closeCamera}
      />
    );
  }

  return (
    <View style={appStyles.containerFluid}>
      <ScrollView 
        style={appStyles.container}
        contentContainerStyle={{ ...appStyles.formScrollContent, paddingBottom: 80 }}
      >
        <View style={appStyles.card}>
          <Text variant="headlineMedium" style={appStyles.formSectionTitle}>
            Aadhaar Verification
          </Text>
          <View style={appStyles.gap}>
            <Text variant="bodyLarge" style={appStyles.textSecondary}>
              Please capture both sides of the Aadhaar card
            </Text>
          </View>
        </View>

        <View style={appStyles.card}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>Front Side</Text>
          <View style={appStyles.gap}>
            {frontImage ? (
              <ImagePreview
                uri={frontImage}
                onRemove={() => handleRemoveImage('front')}
                variant="aadhaar"
              />
            ) : (
              <Button
                mode="outlined"
                onPress={() => openCameraFor('front')}
              >
                Capture Front
              </Button>
            )}
            {errors.frontImage && <Text style={appStyles.errorText}>{errors.frontImage.message}</Text>}
          </View>
        </View>

        <View style={appStyles.card}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>Back Side</Text>
          <View style={appStyles.gap}>
            {backImage ? (
              <ImagePreview
                uri={backImage}
                onRemove={() => handleRemoveImage('back')}
                variant="aadhaar"
              />
            ) : (
              <Button
                mode="outlined"
                onPress={() => openCameraFor('back')}
              >
                Capture Back
              </Button>
            )}
            {errors.backImage && <Text style={appStyles.errorText}>{errors.backImage.message}</Text>}
          </View>
        </View>
      </ScrollView>

      <View style={appStyles.buttonContainer}>
        <View style={appStyles.buttonRow}>
          <Button
            mode="outlined"
            onPress={handleSkip}
          >
            Skip
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </View>
      </View>

      <SuccessAlert
        visible={success}
        message="Aadhaar verification completed successfully"
        onDismiss={handleSuccessDismiss}
      />
    </View>
  );
}
