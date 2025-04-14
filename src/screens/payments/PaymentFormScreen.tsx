import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { appStyles } from '@/theme/styles.new';

import TextField from '@/components/common/CustomTextField';
import CustomDropdown from '@/components/common/CustomDropdown';
import LoadingScreen from '@/components/common/LoadingScreen';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingButton from '@/components/common/LoadingButton';
import SuccessAlert from '@/components/common/SuccessAlert';
import { EntityLookup, SelectedEntityCard } from '@/components/common/EntityLookup';

import { usePaymentForm } from '@/hooks/payments/form/usePaymentForm';
import { DealerLite } from '@/types/dealer';

export default function PaymentFormScreen({ route }: any) {
  const id = route?.params?.dealerId;
  const [selectedDealer, setSelectedDealer] = useState<DealerLite | null>(null);
  const [showDealerLookup, setShowDealerLookup] = useState(false);

  const {
    control,
    errors,
    loading,
    saving,
    error,
    success,
    message,
    handleSubmit,
    onSubmit,
    clearError,
    paymentMethods,
    dealerSearchFn,
    handleCancel,
    handleSuccessDismiss
  } = usePaymentForm(id);

  if (loading) return <LoadingScreen />;

  if (error) {
    return <ErrorMessage message={error} onRetry={clearError} />;
  }

  return (
    <View style={appStyles.containerFluid}>
      <ScrollView
        style={appStyles.container}
        contentContainerStyle={{ ...appStyles.formScrollContent, paddingBottom: 80 }}
      >
        <View style={appStyles.card}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>
            Payment Details
          </Text>
          <View style={appStyles.gap}>
            <Controller
              control={control}
              name="dealer"
              render={({ field: { onChange, value } }) => (
                <>
                  <SelectedEntityCard<DealerLite>
                    value={value as DealerLite}
                    onClear={() => {
                      setSelectedDealer(null);
                      onChange(null);
                    }}
                    entityType="Dealer"
                    displayFields={[
                      { key: 'dealerName', label: 'Dealer Name' },
                      { key: 'dealerMobileNo', label: 'Mobile' }
                    ]}
                    onPress={() => setShowDealerLookup(true)}
                  />

                  {errors.dealer?.id && (
                    <Text style={appStyles.error}>{errors.dealer.id.message}</Text>
                  )}

                  <EntityLookup<DealerLite>
                    visible={showDealerLookup}
                    onClose={() => setShowDealerLookup(false)}
                    searchFn={dealerSearchFn}
                    onSelect={(dealer) => {
                      setSelectedDealer(dealer);
                      onChange(dealer);
                    }}
                    displayFields={[{ key: 'dealerName' }, { key: 'firmName' }]}
                    placeholder="Search by dealer name..."
                  />
                </>
              )}
            />

            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Amount"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(Number(text))}
                  keyboardType="numeric"
                  error={errors.amount?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="paymentMethod"
              render={({ field: { onChange, value } }) => (
                <CustomDropdown
                  label="Payment Method"
                  value={value?.id?.toString() || ''}
                  options={paymentMethods.map(pm => ({
                    label: pm.lookupValue,
                    value: pm.id.toString()
                  }))}
                  onChange={(selectedId) => {
                    const selectedMethod = paymentMethods.find(pm => pm.id === Number(selectedId));
                    onChange(selectedMethod || null);
                  }}
                  error={errors.paymentMethod?.id?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Notes"
                  value={value || ''}
                  onChangeText={onChange}
                  error={errors.notes?.message}
                  multiline
                />
              )}
            />
          </View>
        </View>
      </ScrollView>

      <View style={appStyles.buttonContainer}>
        <View style={appStyles.buttonRow}>
        <Button
          mode="outlined"
          onPress={handleCancel}
        >
          Cancel
        </Button>
        <LoadingButton
          mode="contained"
          onPress={() => handleSubmit(onSubmit)()}
          loading={saving}
          disabled={loading || saving}
          style={[appStyles.col]}
        >
          {id ? 'Update' : 'Create'} Payment
        </LoadingButton>
        </View>
      </View>

      {success && message && (
        <SuccessAlert
          visible={true}
          message={message}
          onDismiss={handleSuccessDismiss}
        />
      )}
    </View>
  );
}
