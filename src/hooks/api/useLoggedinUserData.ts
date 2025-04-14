import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { userStorage } from '@/services/storage/userStorage';

export const useLoggedinUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await userStorage.getUserData();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  return { user, isLoading };
};
