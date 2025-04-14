import { useAuth } from '@/contexts/AuthContext';

export const useAccess = () => {
    const { access } = useAuth();

    const hasPermission = (featureKey: string, permissionType: string): boolean => {
        if (!access?.permissions) return false;

        return access.permissions.some(
            permission =>
                permission.feature.uniqueKey === featureKey &&
                permission.permissionType.uniqueKey === permissionType &&
                permission.isAllowed === 1
        );
    };

    return {
        hasPermission
    };
};