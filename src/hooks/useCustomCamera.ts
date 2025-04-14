import { useState, useCallback } from 'react';
import { Camera } from 'expo-camera';
import { optimizeImage } from '@/utils/imageUtils';

export const useCustomCamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const requestPermission = useCallback(async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setShowCamera(true);
    }
    return status === 'granted';
  }, []);

  const openCamera = useCallback(async () => {
    if (hasPermission === null) {
      await requestPermission();
    } else if (hasPermission) {
      setShowCamera(true);
    }
  }, [hasPermission, requestPermission]);

  const handleCapture = useCallback(async (uri: string) => {
    if (!uri) {
      setImageUri(null);
      setShowCamera(false);
      return;
    }

    try {
      setIsProcessing(true);
      const optimizedUri = await optimizeImage(uri);
      setImageUri(optimizedUri);
    } catch (error) {
      console.error('Error processing image:', error);
      // If optimization fails, use original image
      setImageUri(uri);
    } finally {
      setIsProcessing(false);
      setShowCamera(false);
    }
  }, []);

  const closeCamera = useCallback(() => {
    setShowCamera(false);
  }, []);

  return {
    hasPermission,
    showCamera,
    imageUri,
    isProcessing,
    openCamera,
    requestPermission,
    handleCapture,
    closeCamera,
    setImageUri
  };
};