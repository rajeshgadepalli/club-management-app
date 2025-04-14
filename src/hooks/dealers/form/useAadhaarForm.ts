import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAadhaarScan } from '@/hooks/dealers/api/useAadhaarScan';
import { AadhaarScanRequest } from '@/types/aadhaar';
import { encodeImageToBase64 } from '@/utils/fileUtils';
import { useNavigation } from '@react-navigation/native';

const schema = yup.object({
    frontImage: yup.string().required('Front image is required'),
    backImage: yup.string().required('Back image is required'),
});

export type AadhaarFormData = yup.InferType<typeof schema>;

export const useAadhaarForm = () => {
    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<AadhaarFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            frontImage: '',
            backImage: '',
        },
    });

    const {
        frontData,
        backData,
        extractAadhaarFront,
        extractAadhaarBack,
        loading: isScanning,
        error: scanError,
        resetState: resetScan,
    } = useAadhaarScan();

    const [showCamera, setShowCamera] = useState(false);
    const [cameraTarget, setCameraTarget] = useState<'front' | 'back' | null>(null);
    const [success, setSuccess] = useState(false);

    const frontImage = watch('frontImage');
    const backImage = watch('backImage');

    const openCameraFor = (side: 'front' | 'back') => {
        setCameraTarget(side);
        setShowCamera(true);
    };

    const closeCamera = () => {
        setCameraTarget(null);
        setShowCamera(false);
    };

    const handleCapture = async (uri: string) => {
        if (!cameraTarget) return;

        setValue(cameraTarget === 'front' ? 'frontImage' : 'backImage', uri);
        closeCamera();

        const base64 = await encodeImageToBase64(uri);
        const request: AadhaarScanRequest = {
            imageBase64: base64,
            side: cameraTarget,
        };

        if (cameraTarget === 'front') {
            await extractAadhaarFront(request);
        } else {
            await extractAadhaarBack(request);
        }
    };

    const handleRemoveImage = (side: 'front' | 'back') => {
        setValue(side === 'front' ? 'frontImage' : 'backImage', '');
    };

    const onSubmit = (data: AadhaarFormData) => {
        if (!frontData || !backData) {
            console.error('Missing Aadhaar scan data');
            // You can optionally show a toast/snackbar or alert here
            if (!frontData) {
                setValue('frontImage', '', { shouldValidate: true });
            }
            if (!backData) {
                setValue('backImage', '', { shouldValidate: true });
            }
            return;
        }
        console.log('Submitting Aadhaar verification with:', data);
        console.log("data:", data);
        console.log("frontData:", frontData);
        console.log("backData:", backData);
        // Package the extracted data from Aadhaar scan
        const payload = {
            front: frontData,
            back: backData,
        };

        // Navigate to Dealer form with Aadhaar data
        // navigation.navigate('DealerFormScreen', { aadhaarData: payload });

        setSuccess(true);
    };
    const handleSkip = () => {
        navigation.navigate('DealerForm', { aadhaarData: {} });
        console.log('User skipped Aadhaar verification');
        reset();
        // navigate or skip
    };

    const handleSuccessDismiss = () => {
        setSuccess(false);
        reset();
        navigation.navigate('DealerForm', {
            aadhaarData: {
                front: frontData,
                back: backData,
            },
        });
    };

    return {
        control,
        errors,
        frontImage,
        backImage,
        handleSubmit,
        onSubmit,
        handleSkip,
        openCameraFor,
        closeCamera,
        handleCapture,
        handleRemoveImage,
        showCamera,
        cameraTarget,
        success,
        setSuccess,
        isScanning,
        scanError,
        handleSuccessDismiss
    };
};
