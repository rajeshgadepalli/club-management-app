import React from 'react';
import { IconButton } from 'react-native-paper';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { useAuth as useAuthHook } from '@/hooks/api/useAuth';

const LogoutButton = () => {
    const { clearAuth } = useAuthContext();
    const { logout, isLoading } = useAuthHook();

    const handleLogout = async () => {
        try {
            await logout.execute();
            await clearAuth();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <IconButton
            icon="logout"
            onPress={handleLogout}
            size={24}
            disabled={isLoading}
        />
    );
};

export default LogoutButton;