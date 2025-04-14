import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '@/theme';
import { appStyles } from '@/theme/styles.new';

const LoadingScreen = () => (
    <View style={[appStyles.container, appStyles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
);

export default LoadingScreen;