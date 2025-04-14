import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storage';
import { User } from '@/types/auth';

class UserStorage {
    async getUserData(): Promise<User | null> {
        try {
            const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    async setUserData(user: User): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        } catch (error) {
            console.error('Error setting user data:', error);
            throw error;
        }
    }

    async clearUserData(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
        } catch (error) {
            console.error('Error clearing user data:', error);
            throw error;
        }
    }
}

export const userStorage = new UserStorage();