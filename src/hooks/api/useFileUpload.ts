import { useState, useCallback } from 'react';
import { fileUploadService } from '@/services/api/fileUploadService';

interface UseFileUploadState {
    uploading: boolean;
    error: string | null;
    message: string | null;
    success: boolean;
    uploadedFileKey: string | null;
}

export function useFileUpload() {
    const [state, setState] = useState<UseFileUploadState>({
        uploading: false,
        error: null,
        message: null,
        success: false,
        uploadedFileKey: null,
    });

    const resetUploadState = useCallback(() => {
        setState({
            uploading: false,
            error: null,
            message: null,
            success: false,
            uploadedFileKey: null,
        });
    }, []);

    const uploadBinaryImage = useCallback(async (uri: string) => {
        try {
            setState((prev) => ({ ...prev, uploading: true, error: null }));
            const response = await fileUploadService.uploadBinaryImage(uri);
            setState((prev) => ({
                ...prev,
                uploading: false,
                success: response.success,
                message: response.message || 'File uploaded successfully',
                uploadedFileKey: response.data,
            }));
            return response.data;
        } catch (error: any) {
            setState((prev) => ({
                ...prev,
                uploading: false,
                success: false,
                message: error.response?.data?.message || 'Failed to upload file',
                error: error.response?.data?.message || 'Failed to upload file',
            }));
            throw error;
        }
    }, []);

    return {
        ...state,
        uploadBinaryImage,
        resetUploadState,
    };
}
