import { useCallback } from 'react';
import i18n from '@/localization/i18n';

export const useTranslation = () => {
    const t = useCallback((key: string, params?: Record<string, string | number>) => {
        return i18n.t(key, params);
    }, []);

    const setLocale = useCallback((locale: string) => {
        i18n.locale = locale;
    }, []);

    return {
        t,
        setLocale,
        currentLocale: i18n.locale
    };
};