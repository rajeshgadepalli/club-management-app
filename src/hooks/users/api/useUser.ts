import { useState, useCallback } from 'react';
import { userService } from '@/services/api/users/userService';
import { UserLite } from '@/types/user';
import { FilterField } from '@/types/core';
import { DEFAULT_PAGE_SIZE } from '@/config';

interface UseUserState {
  users: UserLite[];
  loading: boolean;
  error: string | null;
}

export function useUser() {
  const [state, setState] = useState<UseUserState>({
    users: [],
    loading: false,
    error: null
  });

  const searchUsers = useCallback(async (filters: FilterField[] = []) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await userService.getUsers(filters, 0, DEFAULT_PAGE_SIZE);
      setState(prev => ({
        ...prev,
        users: response.data.content
      }));
      return response.data.content;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch users'
      }));
      return [];
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  return {
    ...state,
    searchUsers
  };
}
