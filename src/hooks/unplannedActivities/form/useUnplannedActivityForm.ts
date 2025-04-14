import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';

import {
  unplannedActivitySchema,
  UnplannedActivityForm,
} from "@/schemas/unplannedActivity";
import { useUnplannedActivity } from "../api/useUnplannedActivity";
import { useLookup } from "@/hooks/api/useLookup";
import { useLoggedinUserData } from "@/hooks/api/useLoggedinUserData";
import { UnplannedActivity } from "@/types/unplannedActivity";
import { useCustomCamera } from "@/hooks/useCustomCamera";
import { UserInfo } from "@/types/user";
import { getFullName } from "@/utils/formatters";
import { useFileUpload } from "@/hooks/api/useFileUpload";
import { UPLOADS_URL } from "@/config";

const CATEGORY_LOOKUP_KEY = "UNPLANNED_ACTIVITY";

export function useUnplannedActivityForm() {
  const { user } = useLoggedinUserData();
  const route = useRoute<any>();
  const navigation = useNavigation();

  const { uploadBinaryImage } = useFileUpload();

  const activityId = route?.params?.activity?.id;

  const {
    activity,
    fetchActivity,
    createActivity,
    updateActivity,
    saving,
    loading,
    error,
    success,
    message,
    resetState,
  } = useUnplannedActivity(activityId);

  const { lookups, fetchLookupsByCategories } = useLookup();
  const camera = useCustomCamera();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<UnplannedActivityForm>({
    resolver: yupResolver(unplannedActivitySchema),
    defaultValues: {
      activityDate: new Date(),
      fromTime: new Date(),
      toTime: new Date(),
      categoryId: 0,
      comments: "",
      picture: "",
      subordinateUser: null,
    },
  });

  const categoryOptions =
    lookups
      ?.filter((l) => l.category === CATEGORY_LOOKUP_KEY)
      .map((l) => ({
        label: l.lookupValue,
        value: l.id.toString(),
      })) ?? [];

  const mapToFormValues = (a: UnplannedActivity): UnplannedActivityForm => ({
    activityDate: new Date(a.activityDate),
    fromTime: new Date(a.fromTime),
    toTime: new Date(a.toTime),
    categoryId: a.category?.id || 0,
    comments: a.comments || "",
    picture: a.picture ? UPLOADS_URL + a.picture : "",
    subordinateUser: a.subordinateUser
      ? {
        id: a.subordinateUser.id,
        userName: getFullName(
          a.subordinateUser.firstName,
          a.subordinateUser.lastName
        ),
        designationName: a.subordinateUser.role,
      }
      : null,
  });

  useEffect(() => {
    fetchLookupsByCategories([CATEGORY_LOOKUP_KEY]);
  }, [fetchLookupsByCategories]);

  useEffect(() => {
    if (activityId) {
      fetchActivity(activityId);
    }
  }, [activityId, fetchActivity]);

  useEffect(() => {
    if (activity) {
      console.log(activity);
      reset(mapToFormValues(activity));
    }
  }, [activity, reset]);

  useEffect(() => {
    if (camera.imageUri) {
      setValue("picture", camera.imageUri);
    }
  }, [camera.imageUri, setValue]);

  const handleRemovePhoto = () => {
    setValue("picture", "");
    camera.setImageUri(null);
  };

  const onSubmit = async (data: UnplannedActivityForm) => {
    if (!user) {
      console.error("No user found in session");
      return;
    }

    try {
      let uploadedUrl = data.picture;
      if (data.picture && !data.picture.startsWith("http")) {
        uploadedUrl = await uploadBinaryImage(data.picture);
      }

      const payload = {
        id: activityId,
        user: { id: user.id } as UserInfo,
        activityDate: data.activityDate,
        fromTime: data.fromTime,
        toTime: data.toTime,
        category: { id: data.categoryId },
        comments: data.comments,
        picture: uploadedUrl,
        subordinateUser: data.subordinateUser
          ? ({ id: data.subordinateUser.id } as UserInfo)
          : null,
      } as UnplannedActivity;

      if (activityId) {
        await updateActivity(payload);
      } else {
        await createActivity(payload);
      }

    } catch (err) {
      console.error("Failed to save unplanned activity:", err);
    }
  };

  const clearError = useCallback(() => {
    resetState();
  }, [resetState]);

  const handleSuccessDismiss = (): void => {
    navigation.navigate("Unplanned Activities", {
      screen: "UnplannedActivityList"
    });
    resetState();
  };

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    reset,
    loading,
    saving,
    error,
    success,
    message,
    categoryOptions,
    clearError,
    camera,
    handleRemovePhoto,
    handleSuccessDismiss
  };
}
