import * as FileSystem from 'expo-file-system';
import * as mime from 'mime';
import { optimizeImage } from './imageUtils';

export const createFormDataFromUri = async (uri: string): Promise<FormData> => {
    const formData = new FormData();

    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
        throw new Error('File does not exist');
    }

    const fileExtension = uri.split('.').pop() || '';
    const mimeType = 'image/jpeg';
    // mime.getType(fileExtension) || 

    const fileName = `image_${Date.now()}.${fileExtension}`;

    formData.append('file', {
        uri,
        name: fileName,
        type: mimeType,
    } as any);

    return formData;
};

export const encodeImageToBase64 = async (uri: string): Promise<string> => {
    try {
        // First optimize the image
        const optimizedUri = await optimizeImage(uri);

        // Read the optimized image as base64
        const base64String = await FileSystem.readAsStringAsync(optimizedUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        return base64String;
    } catch (error) {
        console.error('Error encoding image to base64:', error);
        throw error;
    }
};
