import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaymentForm, paymentSchema } from '@/schemas/payment';
import { usePayment } from '../api/usePayment';
import { useLoggedinUserData } from '@/hooks/api/useLoggedinUserData';
import { Dealer, DealerLite } from '@/types/dealer';
import { Lookup, FilterField, FilterOperator } from '@/types/core';
import { useDealer } from '@/hooks/dealers/api/useDealer';
import { useLookup } from '@/hooks/api/useLookup';
import { UserInfo } from '@/types/user';
import { useNavigation } from "@react-navigation/native";

export function usePaymentForm(dealerId?: number) {
  const { user } = useLoggedinUserData();
  const navigation = useNavigation();

  const {
    createPayment,
    loading,
    saving,
    error,
    success,
    message,
    resetState,
  } = usePayment();
  const {
    dealers,
    fetchDealers,
    fetchDealer,
    dealer: fetchedDealer,
  } = useDealer();
  const { fetchLookupsByCategories, loading: paymentMethodLoading } =
    useLookup();

  const [paymentMethods, setPaymentMethods] = useState<Lookup[]>([]);

  // Add useEffect to fetch dealer when ID exists
  useEffect(() => {
    if (dealerId) {
      fetchDealer(dealerId);
    }
  }, [dealerId, fetchDealer]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PaymentForm>({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      dealer: undefined,
      amount: 0,
      paymentMethod: undefined,
      notes: ''
    }
  });

  const onSubmit = async (data: PaymentForm) => {
    if (!user) {
      console.error('No logged in user found');
      return;
    }
    const payload = {
      dealer: { id: data.dealer?.id } as Dealer,
      collectionDate:new Date(),
      amount: data.amount,
      paymentMethod: { id: data.paymentMethod?.id } as Lookup,
      notes: data.notes,
      paymentCollectedBy: { id: user.id } as UserInfo
    };

    try {
      await createPayment(payload);
    } catch (err) {
      console.error('Failed to create payment:', err);
    }
  };

  const dealerSearchFn = async (query: string): Promise<DealerLite[]> => {
    const filters: FilterField[] = [
      { field: 'dealerName', operator: FilterOperator.CONTAINS, value: query }
    ];
    await fetchDealers(filters);
    return dealers;
  };

  const clearError = useCallback(() => {
    resetState();
  }, [resetState]);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      const result = await fetchLookupsByCategories(['PAYMENT_TYPE']);
      setPaymentMethods(result || []);
    };

    loadPaymentMethods();
  }, [fetchLookupsByCategories]);

  // Add conversion function
  const convertToDealerLite = (dealer: Dealer): DealerLite => ({
    id: dealer.id,
    dealerCode: dealer.dealerCode,
    dealerName: dealer.dealerName,
    dealerMobileNo: dealer.dealerMobileNo,
    dealerCreditLimit: dealer.dealerCreditLimit,
    dealerStatus: dealer.dealerStatus,
    firmName: dealer.firmName,
    associatedUserId: dealer.associatedUser?.id || 0,
    dealerCreatedById: dealer.dealerCreatedBy?.id || 0,
    dealerApplDate: dealer.dealerApplDate,
    gstinNumber: dealer.gstinNumber,
  } as DealerLite);

  const handleCancel = (): void => {
    navigation.navigate("Payments", {
      screen: "PaymentList"
    });
    resetState();
  };

  const handleSuccessDismiss = () => {
    handleCancel();
  };

  // Auto-populate when dealer is fetched
  useEffect(() => {
    if (dealerId && fetchedDealer) {
      const dealerLite = convertToDealerLite(fetchedDealer);
      setValue("dealer", dealerLite);
    }
  }, [dealerId, fetchedDealer, setValue]);

  return {
    control,
    handleSubmit,
    onSubmit,
    errors,
    loading,
    saving,
    error,
    success,
    message,
    dealerSearchFn,
    paymentMethods,
    paymentMethodLoading,
    clearError,
    handleCancel,
    handleSuccessDismiss
  };
}
