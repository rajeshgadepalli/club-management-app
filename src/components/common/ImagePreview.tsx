import React, { useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { appStyles } from '@/theme/styles.new';
import { COLORS } from '@/theme';

interface ImagePreviewProps {
    uri: string;
    onRemove?: () => void;
    isRemoteUrl?: boolean;
    readonly?: boolean;
    variant?: 'default' | 'aadhaar';
}

const ImagePreview = ({
    uri,
    onRemove,
    isRemoteUrl = false,
    readonly = false,
    variant = 'default'
}: ImagePreviewProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    
    // Handle remote URLs
    const imageUri = isRemoteUrl
        ? uri.startsWith('http')
            ? uri
            : `http://localhost:8082${uri}`
        : uri;

    const containerStyle = variant === 'aadhaar' ? appStyles.imagePreviewAadhaarContainer : appStyles.imagePreviewContainer;
    const imageStyle = variant === 'aadhaar' ? appStyles.imagePreviewAadhaar : appStyles.imagePreview;

    return (
        <View style={containerStyle}>
            <Image
                source={{
                    uri: imageUri,
                    headers: isRemoteUrl ? {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    } : undefined
                }}
                style={imageStyle}
                resizeMode="cover"
                onLoadStart={() => {
                    console.log('Image loading started for uri:', imageUri);
                    setIsLoading(true);
                    setError(false);
                }}
                onLoadEnd={() => {
                    console.log('Image loaded successfully');
                    setIsLoading(false);
                }}
                onError={(e) => {
                    console.error('Image loading error:', e.nativeEvent);
                    setError(true);
                    setIsLoading(false);
                }}
            />

            {isLoading && (
                <View style={appStyles.center}>
                    <ActivityIndicator
                        size="large"
                        color={COLORS.primary}
                    />
                </View>
            )}

            {error && (
                <View style={appStyles.center}>
                    <Text style={appStyles.error}>
                        Failed to load image
                    </Text>
                </View>
            )}

            {!readonly && onRemove && (
                <IconButton
                    icon="close-circle"
                    size={24}
                    onPress={() => {
                        console.log('ImagePreview: Remove button pressed');
                        onRemove();
                    }}
                    style={appStyles.badge}
                />
            )}
        </View>
    );
};

export default ImagePreview;