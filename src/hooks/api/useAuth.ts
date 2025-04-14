import { useState, useCallback } from "react";
import { Subject } from "rxjs";
import { authApi } from "@/services/api/authService";
import { tokenStorage } from "@/services/api/tokenStorage";
import { ApiError, ApiResponse } from "@/services/api/types";
import { AuthTokens, User, UserAccess } from "@/types/auth";
import { PLATFORM_KEY } from '@/config';

import {
  getDecodedToken,
  getUserKey,
} from "@/utils/jwtUtils";
import { accessStorage } from "@/services/api/accessStorage";
import { userStorage } from "@/services/storage/userStorage";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

// Create a subject for logout events
const logoutSubject = new Subject<void>();

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { setAuthState } = useAuthContext();

  const login = async (mobileNo: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response: ApiResponse<AuthTokens> = await authApi.login({
        mobileNo,
        password,
        appId: PLATFORM_KEY
      });
      const tokens = response.data;
      await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
      const decodedToken = await getDecodedToken();
      const user = decodedToken?.user as User;
      await userStorage.setUserData(user);

      // const accessResponse: ApiResponse<UserAccess> = await authApi.getUserPrivileges();
      // const userAccess = accessResponse.data;
      // await accessStorage.setAccessData(userAccess);
      // TODO: to be enabled when privileges are implemented

      setAuthState({
        isAuthenticated: true,
        user,
        // access: userAccess,
      });

      return tokens;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError({
        message: errorMessage,
        status: err.response?.status || 500,
        errors: err.response?.data?.errors,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      await tokenStorage.clearTokens();
      logoutSubject.next();
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || "Logout failed",
        status: err.response?.status || 500,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    login,
    logout: {
      execute: logout,
      subscribe: (callback: () => void) => {
        const subscription = logoutSubject.subscribe(callback);
        return () => subscription.unsubscribe();
      },
    },
    isLoading,
    error,
  };
};
