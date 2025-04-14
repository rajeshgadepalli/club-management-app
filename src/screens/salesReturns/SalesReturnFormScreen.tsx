import React from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native-paper";
import { Controller, useWatch } from "react-hook-form";

import { appStyles } from "@/theme/styles.new";
import { formatCurrency } from "@/utils/formatters";
import TextField from "@/components/common/CustomTextField";
import LoadingButton from "@/components/common/LoadingButton";
import ErrorMessage from "@/components/common/ErrorMessage";
import SuccessAlert from "@/components/common/SuccessAlert";
import {
  EntityLookup,
  SelectedEntityCard,
} from "@/components/common/EntityLookup";
import DatePickerInput from "@/components/common/CustomDatePicker";
import CustomDropdown from "@/components/common/CustomDropdown";

import { DealerLite } from "@/types/dealer";
import { useSalesReturnForm } from "@/hooks/salesReturn/form/useSalesReturnForm";

export default function SalesReturnFormScreen() {
  const navigation = useNavigation();

  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    saving,
    success,
    message,
    error,
    clearError,
    setDealer,
    showDealerLookup,
    setShowDealerLookup,
    dealerSearchFn,
    reasonOptions,
    lookupReasons,
  } = useSalesReturnForm();

  const watchFields = useWatch({ control });

  if (error) {
    return <ErrorMessage message={error} onRetry={clearError} />;
  }

  return (
    <View style={appStyles.containerFluid}>
      <ScrollView
        style={appStyles.container}
        contentContainerStyle={{
          ...appStyles.formScrollContent,
          paddingBottom: 80,
        }}
      >
        <View style={appStyles.card}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>
            Sales Return Details
          </Text>

          <View style={appStyles.gap}>
            {/* Return Date */}
            <Controller
              control={control}
              name="returnDate"
              render={({ field: { onChange, value } }) => (
                <DatePickerInput
                  label="Return Date"
                  value={value instanceof Date ? value : new Date(value)}
                  onChange={onChange}
                  error={errors.returnDate?.message}
                />
              )}
            />

            {/* Dealer */}
            <Controller
              control={control}
              name="dealer"
              render={({ field: { onChange, value } }) => {
                const selectedDealer = value as DealerLite | null;
                return (
                  <>
                    <SelectedEntityCard<DealerLite>
                      value={selectedDealer}
                      onClear={() => {
                        setDealer(null);
                        onChange(null);
                      }}
                      entityType="Dealer"
                      displayFields={[
                        { key: "dealerName", label: "Name" },
                        { key: "firmName", label: "Firm" },
                      ]}
                      onPress={() => setShowDealerLookup(true)}
                    />

                    {errors.dealer?.id && (
                      <Text style={appStyles.error}>
                        {errors.dealer.id.message}
                      </Text>
                    )}

                    <EntityLookup<DealerLite>
                      visible={showDealerLookup}
                      onClose={() => setShowDealerLookup(false)}
                      searchFn={dealerSearchFn}
                      onSelect={(dealer) => {
                        setDealer(dealer);
                        onChange(dealer);
                      }}
                      displayFields={[
                        { key: "dealerName" },
                        { key: "firmName" },
                      ]}
                      placeholder="Search by dealer name..."
                    />
                  </>
                );
              }}
            />

            {/* Reason */}
            <Controller
              control={control}
              name="reason"
              render={({ field: { onChange, value } }) => (
                <CustomDropdown
                  label="Reason"
                  value={value?.id?.toString() || ""}
                  onChange={(selectedId) => {
                    const matched = lookupReasons.find(
                      (r) => r.id === Number(selectedId)
                    );
                    onChange(matched || null);
                  }}
                  options={reasonOptions.map((item) => ({
                    key: item.value, // 👈 FIXED UNIQUE KEY WARNING
                    label: item.label,
                    value: item.value,
                  }))}
                  error={errors.reason?.id?.message}
                />
              )}
            />

            {/* Total Amount */}
            <Controller
              control={control}
              name="totalAmount"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Total Amount"
                  value={value?.toString() ?? ""}
                  onChangeText={(val) => onChange(Number(val))}
                  keyboardType="numeric"
                  error={errors.totalAmount?.message}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={appStyles.buttonContainer}>
        <LoadingButton
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={saving}
          disabled={saving}
        >
          Save Return
        </LoadingButton>
      </View>

      {/* Success Alert */}
      {success && message && (
        <SuccessAlert
          visible={true}
          message={message}
          onDismiss={() => navigation.goBack()}
        />
      )}
    </View>
  );
}
