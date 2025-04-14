import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storage';
import { PinCodeDirectory } from '@/types/geolocation';

class LocationStorage {
    async getPinCodeData(): Promise<PinCodeDirectory[] | null> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.PIN_CODE_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting pin code data:', error);
            return null;
        }
    }

    async setPinCodeData(data: PinCodeDirectory[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.PIN_CODE_DATA, JSON.stringify(data));
        } catch (error) {
            console.error('Error setting pin code data:', error);
            throw error;
        }
    }

    async getLastSyncDate(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.PIN_CODE_SYNC_DATE);
        } catch (error) {
            console.error('Error getting last sync date:', error);
            return null;
        }
    }

    async setLastSyncDate(date: string): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.PIN_CODE_SYNC_DATE, date);
        } catch (error) {
            console.error('Error setting last sync date:', error);
            throw error;
        }
    }

    async clearPinCodeData(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.PIN_CODE_DATA,
                STORAGE_KEYS.PIN_CODE_SYNC_DATE
            ]);
        } catch (error) {
            console.error('Error clearing pin code data:', error);
            throw error;
        }
    }
}

export const locationStorage = new LocationStorage();
