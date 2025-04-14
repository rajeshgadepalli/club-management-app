import React, { useRef, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from 'expo-camera'; 
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import { SPACING } from '@/theme';

interface CustomCameraProps {
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export default function CustomCamera({ onCapture, onClose }: CustomCameraProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  const initialPinchScale = useRef(1);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        onCapture(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };
  const onPinchGestureEvent = (event) => {
    const scaleChange = event.nativeEvent.scale - initialPinchScale.current;
    const zoomSensitivity = 0.09; // Lower = smoother
    let newZoom = zoom + scaleChange * zoomSensitivity;
  
    // Clamp zoom between 0 and 1
    newZoom = Math.max(0, Math.min(1, newZoom));
    setZoom(newZoom);
  };
  
  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.BEGAN) {
      initialPinchScale.current = event.nativeEvent.scale;
    }
  };
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchHandlerStateChange}
      >
        <View style={styles.container}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            zoom={zoom} 
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Text style={styles.text}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.text}>Close</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: SPACING.md,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
        justifyContent: 'space-between',
    },
    button: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        padding: SPACING.sm,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});
