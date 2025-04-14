import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import { useUser } from '@/hooks/users/api/useUser';
import TextField from '@/components/common/CustomTextField';
import CustomDropdown from '@/components/common/CustomDropdown';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import LoadingButton from '@/components/common/LoadingButton';
import LoadingScreen from '@/components/common/LoadingScreen';
import ErrorMessage from '@/components/common/ErrorMessage';
import { EntityLookup, SelectedEntityCard } from '@/components/common/EntityLookup';
import { UserLite } from '@/types/user';
import { appStyles } from '@/theme/styles.new';
import { FilterOperator } from '@/types/core';
import { useDealerForm } from '@/hooks/dealers/form/useDealerForm';
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export default function DealerFormScreen({ route }: any) {
  const id = route?.params?.id;
  const [selectedUser, setSelectedUser] = useState<UserLite | null>(null);
  const [showUserLookup, setShowUserLookup] = useState(false);
  const { searchUsers } = useUser();

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
    regions,
    regionLoading,
    handleSuccessDismiss,
    handleSuccessSales,
    handleCancel
  } = useDealerForm(id);

  if (loading || regionLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => clearError()}
      />
    );
  }

  return (
    <View style={appStyles.containerFluid}>
      <ScrollView
        style={appStyles.container}
        contentContainerStyle={{ ...appStyles.formScrollContent, paddingBottom: 80 }}
      >
        <View style={appStyles.card}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>
            Basic Information
          </Text>
          <View style={appStyles.gap}>
            <Controller
              control={control}
              name="dealerName"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Dealer Name"
                  value={value || ''}
                  onChangeText={onChange}
                  error={errors.dealerName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="dealerMobileNo"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Mobile Number"
                  value={value || ''}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  error={errors.dealerMobileNo?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="dealerCreditLimit"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Credit Limit"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(Number(text))}
                  keyboardType="numeric"
                  error={errors.dealerCreditLimit?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="gstinNumber"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="GSTIN"
                  value={value || ''}
                  onChangeText={onChange}
                  error={errors.gstinNumber?.message}
                  autoCapitalize="characters"
                />
              )}
            />

            <Controller
              control={control}
              name="dealerApplDate"
              render={({ field: { onChange, value } }) => (
                <CustomDatePicker
                  label="Application Date"
                  value={value}
                  onChange={onChange}
                  error={errors.dealerApplDate?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, value } }) => (
                <CustomDatePicker
                  label="Date of Birth"
                  value={value}
                  onChange={onChange}
                  error={errors.dateOfBirth?.message}
                />
              )}
            />
          </View>
        </View>

        <View style={appStyles.card}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>
            Firm Details
          </Text>
          <View style={appStyles.gap}>
            <Controller
              control={control}
              name="firmName"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Firm Name"
                  value={value || ''}
                  onChangeText={onChange}
                  error={errors.firmName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="firmAddressPinCode"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Pincode"
                  value={value}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, '');
                    onChange(numericValue);
                  }}
                  keyboardType="numeric"
                  error={errors.firmAddressPinCode?.message}
                />
              )}
            />

            <View style={appStyles.row}>
              <View style={appStyles.col}>
                <Controller
                  control={control}
                  name="firmVillage"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      label="Village"
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.firmVillage?.message}
                    />
                  )}
                />
              </View>
              <View style={appStyles.col}>
                <Controller
                  control={control}
                  name="firmMandal"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      label="Mandal"
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.firmMandal?.message}
                    />
                  )}
                />
              </View>
            </View>

            <View style={appStyles.row}>
              <View style={appStyles.col}>
                <Controller
                  control={control}
                  name="firmDistrict"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      label="District"
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.firmDistrict?.message}
                    />
                  )}
                />
              </View>
              <View style={appStyles.col}>
                <Controller
                  control={control}
                  name="firmState"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      label="State"
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.firmState?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={appStyles.card}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>
            Additional Information
          </Text>
          <View style={appStyles.gap}>
            <Controller
              control={control}
              name="associatedUser"
              render={({ field: { onChange, value } }) => (
                <>
                  <SelectedEntityCard<UserLite>
                    value={value as UserLite}
                    onClear={() => {
                      setSelectedUser(null);
                      onChange(null);
                    }}
                    entityType="User"
                    displayFields={[
                      { key: 'userName', label: 'User Name' },
                      { key: 'designationName', label: 'Designation' }
                    ]}
                    onPress={() => setShowUserLookup(true)}
                  />

                  {errors.associatedUser?.id && (
                    <Text style={appStyles.error}>{errors.associatedUser.id.message}</Text>
                  )}

                  <EntityLookup<UserLite>
                    visible={showUserLookup}
                    onClose={() => setShowUserLookup(false)}
                    searchFn={async (query) =>
                      await searchUsers([
                        { field: 'userName', operator: FilterOperator.CONTAINS, value: query }
                      ])
                    }
                    onSelect={(user) => {
                      setSelectedUser(user);
                      onChange(user); // 
                    }}
                    displayFields={[
                      { key: 'userName' },
                      { key: 'designationName' }
                    ]}
                    placeholder="Search by username..."
                  />
                </>
              )}
            />

            <Controller
              control={control}
              name="region"
              render={({ field: { onChange, value } }) => (
                <CustomDropdown
                  label="Region"
                  value={value?.id?.toString() || ''}
                  options={regions.map(r => ({
                    label: r.regionName,
                    value: r.id.toString(),
                  }))}
                  onChange={(selectedId) => {
                    const selectedRegion = regions.find(r => r.id === Number(selectedId));
                    onChange(selectedRegion || null);
                  }}
                  error={errors.region?.id?.message}
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
            onPress={() => {
              handleSubmit(
                onSubmit,
                (formErrors) => {
                  console.log('❌ Validation failed:', formErrors);
                }
              )();
            }}
            loading={saving}
            disabled={loading || saving}
          >
            {id ? 'Update' : 'Create'} Dealer
          </LoadingButton>
        </View>
      </View>

      {success && message && (
        <ConfirmationDialog
          visible={true}
          title={message}
          message="Do you want to create sales order?"
          onConfirm={handleSuccessSales}
          onCancel={handleSuccessDismiss}
        />
      )}
    </View>
  );
}