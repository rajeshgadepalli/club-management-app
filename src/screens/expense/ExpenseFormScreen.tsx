import React from "react";
import { Controller } from "react-hook-form";
import { View, ScrollView } from "react-native";
import { Button, Portal, Text } from "react-native-paper";

import { appStyles } from "@/theme/styles.new";
import { useExpenseForm } from "@/hooks/expenses/form/useExpenseForm";
import TextField from "@/components/common/CustomTextField";
import CustomDatePicker from "@/components/common/CustomDatePicker";
import CustomTimePicker from "@/components/common/CustomTimePicker";
import CustomDropdown from "@/components/common/CustomDropdown";
import CustomCamera from "@/components/camera/CustomCamera";
import ImagePreview from "@/components/common/ImagePreview";
import LoadingButton from "@/components/common/LoadingButton";
import SuccessAlert from "@/components/common/SuccessAlert";
import { FilteredExpOptions } from "@/types/expense";
import ErrorMessage from "@/components/common/ErrorMessage";
import LoadingScreen from "@/components/common/LoadingScreen";

const expenseOptions = [
  { label: "Auto", value: "Auto" },
  { label: "Bike", value: "Bike" },
  { label: "Bus", value: "Bus" },
  { label: "Car", value: "Car" },
  { label: "Daily Allowances", value: "Daily Allowances" },
  { label: "Flight", value: "Flight" },
  { label: "Fuel Expenses", value: "Fuel Expenses" },
  { label: "Mobile Recharge", value: "Mobile Recharge" },
  { label: "Night Halt", value: "Night Halt" },
  { label: "Others", value: "Others" },
  { label: "Repair", value: "Repair" },
  { label: "Rikshaw", value: "Rikshaw" },
  { label: "Stationary", value: "Stationary" },
  { label: "Toll tax", value: "Toll tax" },
  { label: "Train", value: "Train" },
];

export default function ExpenseFormScreen({ route }: any) {
  const id = route?.params?.id;

  const {
    control,
    camera: { showCamera, imageUri, openCamera, handleCapture, closeCamera },
    errors,
    loading,
    saving,
    error,
    success,
    message,
    selectedCategory,
    handleSubmit,
    handleRemovePhoto,
    onSubmit,
    clearError,
    camera,
    handleSuccessDismiss
  } = useExpenseForm(id);

  if (loading) {
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
              name="expenseDate"
              render={({ field: { onChange, value } }) => (
                <CustomDatePicker
                  label="Expense Date"
                  value={value}
                  onChange={onChange}
                  error={errors.expenseDate?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Amount"
                  type="number"
                  value={value?.toString()}
                  keyboardType="numeric"
                  onChangeText={onChange}
                  error={errors.amount?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field: { onChange, value } }) => (
                <CustomDropdown
                  label="Category"
                  value={value}
                  onChange={onChange}
                  options={expenseOptions}
                  error={errors.category?.message}
                />
              )}
            />

            {FilteredExpOptions.includes(selectedCategory) && (
              <>
                <Controller
                  control={control}
                  name="journeyFrom"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      label="Journey From"
                      value={value || ""}
                      onChangeText={onChange}
                      error={errors.journeyFrom?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="journeyTo"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      label="Journey To"
                      value={value || ""}
                      onChangeText={onChange}
                      error={errors.journeyTo?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="startTime"
                  render={({ field: { onChange, value } }) => (
                    <CustomTimePicker
                      label="Start Time"
                      value={value as Date}
                      onChange={onChange}
                      error={errors.startTime?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="endTime"
                  render={({ field: { onChange, value } }) => (
                    <CustomTimePicker
                      label="End Time"
                      value={value ?? new Date()}
                      onChange={onChange}
                      error={errors.endTime?.message}
                    />
                  )}
                />
              </>
            )}

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Description"
                  value={value || ""}
                  onChangeText={onChange}
                  error={errors.description?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Location"
                  value={value || ""}
                  onChangeText={onChange}
                  error={errors.location?.message}
                  autoCapitalize="characters"
                />
              )}
            />
          </View>
        </View>

        <View style={appStyles.card}>
          <Controller
            control={control}
            name="picture"
            render={({ field: { onChange, value } }) => (
              <View>
                {value ? (
                  <ImagePreview
                    uri={value}
                    onRemove={handleRemovePhoto}
                    isRemoteUrl={
                      value.startsWith("http") || value.startsWith("/uploads")
                    }
                  />
                ) : (
                  <Button mode="outlined" onPress={camera.openCamera}>
                    Take Photo
                  </Button>
                )}
              </View>
            )}
          />
        </View>
      </ScrollView>

      <View style={appStyles.buttonContainer}>
        <View style={appStyles.buttonRow}>
          <Button
            mode="outlined"
            onPress={handleSuccessDismiss}
          >
            Cancel
          </Button>
          <LoadingButton
            mode="contained"
            onPress={() => handleSubmit(onSubmit)()}
            loading={saving}
            disabled={loading || saving}
            style={appStyles.col}
          >
            {id ? "Update" : "Create"} Expense
          </LoadingButton>
        </View>
      </View>

      {showCamera && (
        <Portal>
          <CustomCamera onCapture={handleCapture} onClose={closeCamera} />
        </Portal>
      )}

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
