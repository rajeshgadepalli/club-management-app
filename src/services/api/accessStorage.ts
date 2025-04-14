import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storage';
import { UserAccess } from '@/types/auth';

class AccessStorage {
  async getAccessData(): Promise<UserAccess | null> {
    try {
      const accessData = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_DATA);
      return accessData ? JSON.parse(accessData) : null;
    } catch (error) {
      console.error('Error getting access data:', error);
      return null;
    }
  }

  async setAccessData(access: UserAccess): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_DATA, JSON.stringify(access));
    } catch (error) {
      console.error('Error setting access data:', error);
      throw error;
    }
  }

  async clearAccessData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_DATA);
    } catch (error) {
      console.error('Error clearing access data:', error);
      throw error;
    }
  }
}

export const accessStorage = new AccessStorage();