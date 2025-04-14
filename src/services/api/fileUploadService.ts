import { apiClient } from './client';
import { ApiResponse } from './types';
import { createFormDataFromUri } from '@/utils/fileUtils';

const generateImageKey = (prefix: string) => {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
};

export const fileUploadService = {
    uploadBinaryImage: async (uri: string): Promise<ApiResponse<string>> => {
        try {
            const formData = await createFormDataFromUri(uri);
            const imageKey = generateImageKey("img");
            const response = await apiClient.post(`/file-upload/binary-image?imageKey=${imageKey}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                },
                transformRequest: (data) => data,
            });

            return response.data;
        } catch (error) {
            console.error('File upload error:', error);
            throw error;
        }
    },
};