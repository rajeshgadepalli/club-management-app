import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DealerForm, dealerSchema } from '@/schemas/dealer';
import { useDealer } from '../api/useDealer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLoggedinUserData } from '@/hooks/api/useLoggedinUserData';
import { useLookup } from '@/hooks/api/useLookup';
import { Dealer } from '@/types/dealer';
import { UserInfo } from '@/types/user';
import { Region } from '@/types/core';
import { AadhaarData } from '@/types/aadhaar';
import { useGeolocation } from '@/hooks/geolocation/useGeolocation';

export function useDealerForm(id?: number) {
  const { user } = useLoggedinUserData();

  const route = useRoute<any>();
  const aadhaarData: AadhaarData | undefined = route?.params?.aadhaarData;
  const navigation = useNavigation();

  // const aadhaarFront=aadhaarData?.front;
  // const aadhaarBack=aadhaarData?.back;

  const {
    dealer,
    loading,
    saving,
    error,
    success,
    message,
    createDealer,
    updateDealer,
    fetchDealer,
    resetState
  } = useDealer(id);

  const { regions, fetchRegions, loading: regionLoading } = useLookup();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealerForm>({
    resolver: yupResolver(dealerSchema),
    defaultValues: {
      dealerName: '',
      dealerMobileNo: '',
      firmName: '',
      firmVillage: '',
      firmMandal: '',
      firmDistrict: '',
      firmState: '',
      firmAddressPinCode: '',
      dealerCreditLimit: 0,
      dealerApplDate: new Date(),
      gstinNumber: '',
      dateOfBirth: new Date(),
      region: undefined,
      associatedUser: undefined
    },
  });


  const mapDealerToFormValues = (dealer: Dealer): DealerForm => ({
    dealerName: dealer.dealerName,
    dealerMobileNo: dealer.dealerMobileNo,
    firmName: dealer.firmName,
    firmVillage: dealer.firmVillage,
    firmMandal: dealer.firmMandal,
    firmDistrict: dealer.firmDistrict,
    firmState: dealer.firmState,
    firmAddressPinCode: dealer.firmAddressPinCode,
    dealerCreditLimit: dealer.dealerCreditLimit,
    dealerApplDate: new Date(dealer.dealerApplDate),
    gstinNumber: dealer.gstinNumber,
    dateOfBirth: new Date(dealer.dateOfBirth),

    // Nested optional objects
    region: dealer.region
      ? { id: dealer.region.id, regionName: dealer.region.regionName }
      : undefined,

    associatedUser: dealer.associatedUser
      ? {
        id: dealer.associatedUser.id,
        userName: dealer.associatedUser.firstName,
        designationName: dealer.associatedUser.role,
      }
      : undefined,
  });

  const { getAddressFromLocation, address, loading: geolocationLoading } = useGeolocation();

  const prefillFromLocation = useCallback(async () => {
    try {
      await getAddressFromLocation();
      if (address) {
        reset(prev => ({
          ...prev,
          firmVillage: address.village || '',
          firmMandal: address.mandal || '',
          firmDistrict: address.district || '',
          firmState: address.state || '',
          firmAddressPinCode: address.pinCode || '',
        }));
      }
    } catch (error) {
      console.log('Failed to get location:', error);
    }
  }, [reset, getAddressFromLocation, address]);

  const prefillFromAadhaar = useCallback(() => {
    if (!aadhaarData) return;

    const front = aadhaarData.front;
    const back = aadhaarData.back;

    if (front || back) {
      reset(prev => ({
        ...prev,
        dealerName: front?.recipientName || '',
        dealerMobileNo: front?.aadhaano?.slice(-10) || '',
        firmVillage: back?.village || '',
        firmMandal: back?.mandal || '',
        firmDistrict: back?.district || '',
        firmState: back?.state || '',
        firmAddressPinCode: back?.pinCode || '',
      }));
    }
  }, [aadhaarData, reset]);

  useEffect(() => {
    if (id) {
      fetchDealer(id);
    } else if (aadhaarData && Object.keys(aadhaarData).length > 0) {
      prefillFromAadhaar();
    }
    //  else {
    //   prefillFromLocation();
    // }
    // }, [id, fetchDealer, aadhaarData, prefillFromAadhaar, prefillFromLocation]);
  }, [id, fetchDealer, aadhaarData, prefillFromAadhaar]);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  useEffect(() => {
    if (dealer) {
      reset(mapDealerToFormValues(dealer));
    }
  }, [dealer, reset]);

  const onSubmit = async (data: DealerForm) => {
    if (!user) {
      console.error('No user found in storage');
      return;
    }

    try {

      const dealerPayload: Partial<Dealer> = {
        ...data,
        dealerCode: dealer?.dealerCode,
        dealerStatus: 'ACTIVE',
        dealerCreatedBy: {
          id: user.id
        } as UserInfo,
        dealerCreatedDate: new Date(),
      };

      if (data.associatedUser) {
        dealerPayload.associatedUser = {
          id: data.associatedUser.id
        } as UserInfo;
      }
      if (data.region) {
        dealerPayload.region = {
          id: data.region.id
        } as Region;
      }
      if (id) {
        await updateDealer({ ...dealerPayload, id });
      } else {
        await createDealer(dealerPayload);
      }

    } catch (err) {
      console.error('Failed to save dealer:', err);
    }
  };

  const handleSuccessDismiss = (): void => {
    navigation.navigate("Dealers", {
      screen: "DealerList",
    });
    resetState();
  };

  const handleSuccessSales = (): void => {
    navigation.navigate("Sales Orders", {
      screen: "SalesOrderForm",
      params: { dealerId: dealer?.id },
    });
    resetState();
    navigation.goBack();
  };

  const handleCancel = (): void => {
    navigation.navigate("Dealers", {
      screen: "DealerList"
    });
    resetState();
  };

  const clearError = useCallback(() => {
    resetState();
  }, [resetState]);

  return {
    // Form state
    control,
    errors,
    handleSubmit,
    onSubmit,
    loading,
    regionLoading,
    geolocationLoading,
    saving,
    error,
    success,
    message,
    regions,
    fetchDealer,
    createDealer,
    updateDealer,
    handleSuccessDismiss,
    handleSuccessSales,
    clearError,
    handleCancel
  };
}
