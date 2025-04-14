import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserAccess } from '@/types/auth';
import { tokenStorage } from '@/services/api/tokenStorage';
import { userStorage } from '@/services/storage/userStorage';
import { accessStorage } from '@/services/api/accessStorage';

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    access: UserAccess | null;
}

interface AuthContextType extends AuthState {
    setAuthState: (state: Partial<AuthState>) => void;
    clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    access: null,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>(initialState);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            // Check if we have a valid token
            const token = await tokenStorage.getAccessToken();
            if (!token) {
                return;
            }

            const userData = await userStorage.getUserData();
            const accessData = await accessStorage.getAccessData();
            setAuthState({
                isAuthenticated: !!token,
                user: userData,
                access: accessData,
            });
        } catch (error) {
            console.error('Error initializing auth:', error);
            clearAuth();
        }
    };

    const updateAuthState = (newState: Partial<AuthState>) => {
        setAuthState(prev => ({ ...prev, ...newState }));
    };

    const clearAuth = async () => {
        try {
            await Promise.all([
                tokenStorage.clearTokens(),
                userStorage.clearUserData(),
                accessStorage.clearAccessData(),
            ]);
            setAuthState(initialState);
        } catch (error) {
            console.error('Error clearing auth:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                setAuthState: updateAuthState,
                clearAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};