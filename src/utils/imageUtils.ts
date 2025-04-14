import * as ImageManipulator from 'expo-image-manipulator';

export const optimizeImage = async (uri: string): Promise<string> => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [
                { resize: { width: 1024 } },
            ],
            {
                compress: 0.7, // 70% quality
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );

        return result.uri;
    } catch (error) {
        console.error('Error optimizing image:', error);
        throw error;
    }
};
