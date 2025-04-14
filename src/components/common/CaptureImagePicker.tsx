import React from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { COLORS, SPACING } from "@/theme";

interface CaptureImagePickerProps {
  value?: string;
  onChange: (uri: string) => void;
  error?: string;
}

const CaptureImagePicker: React.FC<CaptureImagePickerProps> = ({
  value,
  onChange,
  error,
}) => {
  const handleCapture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.captureBox} onPress={handleCapture}>
        {value ? (
          <Image source={{ uri: value }} style={styles.imagePreview} />
        ) : (
          <View style={styles.placeholder}>
            <Camera size={32} color={COLORS.primary} />
            <Text style={styles.label}>Capture Picture</Text>
          </View>
        )}
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CaptureImagePicker;

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  captureBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginTop: 8,
    color: COLORS.text,
    fontSize: 14,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});
