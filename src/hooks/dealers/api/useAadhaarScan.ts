import { useState, useCallback } from 'react';
import { AadhaarFrontData, AadhaarBackData, AadhaarScanRequest } from '@/types/aadhaar';
import { aadhaarService } from '@/services/api/aadhaar/aadhaarService';

interface AadhaarScanState {
    frontData: AadhaarFrontData | null;
    backData: AadhaarBackData | null;
    loading: boolean;
    error: string | null;
    message: string | null;
    success: boolean;
}

export function useAadhaarScan() {
    const [state, setState] = useState<AadhaarScanState>({
        frontData: null,
        backData: null,
        loading: false,
        error: null,
        message: null,
        success: false,
    });

    const resetState = useCallback(() => {
        setState({
            frontData: null,
            backData: null,
            loading: false,
            error: null,
            message: null,
            success: false,
        });
    }, []);

    const extractAadhaarFront = useCallback(async (payload: AadhaarScanRequest) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await aadhaarService.extractFront(payload);
            setState(prev => ({
                ...prev,
                frontData: response.data,
                message: response.message || 'Front side data extracted successfully',
                success: true,
                loading: false,
            }));
            return response.data;
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error?.response?.data?.message || 'Failed to extract front side',
                success: false,
            }));
            throw error;
        }
    }, []);

    const extractAadhaarBack = useCallback(async (payload: AadhaarScanRequest) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await aadhaarService.extractBack(payload);
            setState(prev => ({
                ...prev,
                backData: response.data,
                message: response.message || 'Back side data extracted successfully',
                success: true,
                loading: false,
            }));
            return response.data;
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error?.response?.data?.message || 'Failed to extract back side',
                success: false,
            }));
            throw error;
        }
    }, []);

    return {
        ...state,
        extractAadhaarFront,
        extractAadhaarBack,
        resetState,
    };
}
