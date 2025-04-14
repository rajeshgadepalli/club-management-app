import { useEffect, useCallback } from 'react';
import { useDelivery } from '@/hooks/deliveries/api/useDelivery';
import { useNavigation } from '@react-navigation/native';
import { Delivery } from '@/types/delivery';
import { useLoggedinUserData } from '@/hooks/api/useLoggedinUserData';
import { UserInfo } from '@/types/user';

export function useDeliveryForm(id?: number) {
  const { user } = useLoggedinUserData();

  const {
    delivery,
    loading,
    saving,
    error,
    message,
    success,
    fetchDelivery,
    confirmDelivery,
    resetState,
  } = useDelivery(id);

  // Automatically fetch delivery if ID is present
  useEffect(() => {
    if (id) {
      fetchDelivery(id);
    }
  }, [id, fetchDelivery]);

  const handleConfirmDelivery = useCallback(async () => {
    if (!delivery?.id) return;
    try {
      delivery.deliveredBy = { id: user?.id } as UserInfo;
      await confirmDelivery(delivery.id, delivery);
    } catch (err) {
      console.error('❌ Failed to confirm delivery:', err);
    }
  }, [delivery, confirmDelivery]);

  const clearError = useCallback(() => {
    resetState();
  }, [resetState]);

  return {
    delivery,
    loading,
    saving,
    error,
    message,
    success,
    handleConfirmDelivery,
    clearError,
  };
}
