import React from "react";
import { View, ScrollView } from "react-native";
import { Text, Button, Portal } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Controller } from "react-hook-form";

import CustomTextField from "@/components/common/CustomTextField";
import CustomDropdown from "@/components/common/CustomDropdown";
import CustomTimePicker from "@/components/common/CustomTimePicker";
import CustomDatePicker from "@/components/common/CustomDatePicker";
import LoadingButton from "@/components/common/LoadingButton";
import SuccessAlert from "@/components/common/SuccessAlert";
import ImagePreview from "@/components/common/ImagePreview";
import CustomCamera from "@/components/camera/CustomCamera";

import {
  EntityLookup,
  SelectedEntityCard,
} from "@/components/common/EntityLookup";
import { useUser } from "@/hooks/users/api/useUser";
import { FilterOperator } from "@/types/core";
import { UserLite } from "@/types/user";

import { useUnplannedActivityForm } from "@/hooks/unplannedActivities/form/useUnplannedActivityForm";
import { useUnplannedActivitiesList } from "@/hooks/unplannedActivities/list/useUnplannedActivitiesList";

import { appStyles } from "@/theme/styles.new";

export default function UnplannedActivityFormScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const activityId = route?.params?.activity?.id;

  const { searchUsers } = useUser();

  const [showUserLookup, setShowUserLookup] = React.useState(false);

  const {
    control,
    handleSubmit,
    onSubmit,
    errors,
    saving,
    success,
    message,
    categoryOptions,
    camera,
    handleRemovePhoto,
    handleSuccessDismiss
  } = useUnplannedActivityForm();

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
            {activityId ? "Edit" : "New"} Unplanned Activity
          </Text>

          <View style={appStyles.gap}>
            <Controller
              control={control}
              name="activityDate"
              render={({ field: { onChange, value } }) => (
                <CustomDatePicker
                  label="Activity Date"
                  value={value}
                  onChange={onChange}
                  error={errors.activityDate?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="fromTime"
              render={({ field: { onChange, value } }) => (
                <CustomTimePicker
                  label="From Time"
                  value={value}
                  onChange={onChange}
                  error={errors.fromTime?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="toTime"
              render={({ field: { onChange, value } }) => (
                <CustomTimePicker
                  label="To Time"
                  value={value}
                  onChange={onChange}
                  error={errors.toTime?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="categoryId"
              render={({ field: { onChange, value } }) => (
                <CustomDropdown
                  label="Category"
                  value={value?.toString() || ""}
                  onChange={(val) => onChange(Number(val))}
                  options={categoryOptions}
                  error={errors.categoryId?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="comments"
              render={({ field: { onChange, value } }) => (
                <CustomTextField
                  label="Comments"
                  value={value as string}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                  error={errors.comments?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="subordinateUser"
              render={({ field: { onChange, value } }) => (
                <>
                  <SelectedEntityCard<UserLite>
                    value={value as UserLite}
                    onClear={() => onChange(null)}
                    entityType="User"
                    displayFields={[
                      { key: "userName", label: "User Name" },
                      { key: "designationName", label: "Designation" },
                    ]}
                    onPress={() => setShowUserLookup(true)}
                  />

                  <EntityLookup<UserLite>
                    visible={showUserLookup}
                    onClose={() => setShowUserLookup(false)}
                    searchFn={async (query) =>
                      await searchUsers([
                        {
                          field: "userName",
                          operator: FilterOperator.CONTAINS,
                          value: query,
                        },
                      ])
                    }
                    onSelect={(user) => {
                      onChange(user);
                      setShowUserLookup(false);
                    }}
                    displayFields={[
                      { key: "userName" },
                      { key: "designationName" },
                    ]}
                    placeholder="Search by username..."
                  />
                </>
              )}
            />
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
        </View>
      </ScrollView>

      <View style={appStyles.buttonContainer}>
        <View style={appStyles.buttonRow}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
          >
            Cancel
          </Button>
          <LoadingButton
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={saving}
            disabled={saving}
            style={appStyles.col}
          >
            {activityId ? "Update Activity" : "Save Activity"}
          </LoadingButton>
        </View>
      </View>

      {camera.showCamera && (
        <Portal>
          <CustomCamera
            onCapture={camera.handleCapture}
            onClose={camera.closeCamera}
          />
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
