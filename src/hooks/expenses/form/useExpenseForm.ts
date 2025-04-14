import { useCallback, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLoggedinUserData } from "@/hooks/api/useLoggedinUserData";
import { UserInfo } from "@/types/user";
import { useExpense } from "../api/useExpense";
import { Expense, ExpenseCategory, ExpenseStatus } from "@/types/expense";
import { ExpenseForm, expenseSchema } from "@/schemas/expense";
import { useCustomCamera } from "@/hooks/useCustomCamera";
import { useFileUpload } from "@/hooks/api/useFileUpload";
import { UPLOADS_URL } from "@/config";

export function useExpenseForm(id?: number) {
  const { user } = useLoggedinUserData();
  const navigation = useNavigation();
  const camera = useCustomCamera();
  const { uploadBinaryImage } = useFileUpload();

  const {
    expense,
    loading,
    saving,
    error,
    success,
    message,
    createExpense,
    updateExpense,
    fetchExpense,
    resetState,
  } = useExpense(id);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExpenseForm>({
    resolver: yupResolver(expenseSchema),
    defaultValues: {
      expenseDate: new Date(),
      amount: undefined,
      category: undefined,
      journeyFrom: "",
      journeyTo: "",
      startTime: undefined,
      endTime: undefined,
      description: "",
      picture: "",
      location: "",
      expenseStatus: ExpenseStatus.PENDING,
      approvalStateHead: undefined,
      approvalZonalManager: undefined,
    },
  });

  const mapExpenseToFormValues = (expense: Expense): ExpenseForm => ({
    expenseDate: new Date(expense.expenseDate),
    amount: expense.amount,
    category: expense.category as ExpenseCategory,
    journeyFrom: expense.journeyFrom,
    journeyTo: expense.journeyTo,
    startTime: expense.startTime,
    endTime: expense.endTime,
    description: expense.description,
    picture: expense.picture ? UPLOADS_URL + expense.picture : "",
    location: expense.location,
    expenseStatus: expense.expenseStatus,
    approvalStateHead: expense.approvalStateHead,
    approvalZonalManager: expense.approvalZonalManager
  });

  const selectedCategory = useWatch({
    control,
    name: "category",
  });

  useEffect(() => {
    if (expense) {
      reset(mapExpenseToFormValues(expense));
    }
  }, [expense, reset]);

  useEffect(() => {
    if (id) {
      fetchExpense(id);
    }
  }, [id, fetchExpense]);

  // Update picture field when camera imageUri changes
  useEffect(() => {
    if (camera.imageUri) {
      setValue("picture", camera.imageUri);
    }
  }, [camera.imageUri, setValue]);

  const handleRemovePhoto = () => {
    setValue("picture", "");
    camera.setImageUri(null);
  };

  const onSubmit = async (data: ExpenseForm) => {
    if (!user) {
      console.error("No user found in storage");
      return;
    }
    let uploadedUrl = data.picture;
    if (data.picture && !data.picture.startsWith("http")) {
      uploadedUrl = await uploadBinaryImage(data.picture);
    }

    try {
      const expensePayload: Partial<Expense> = {
        ...data,
        picture: uploadedUrl,
        expenseBy: {
          id: user.id,
        } as UserInfo,
      };

      if (id) {
        await updateExpense({ ...expensePayload, id });
      } else {
        await createExpense(expensePayload);
      }
    } catch (err) {
      console.error("Failed to save expense:", err);
    }
  };

  const clearError = useCallback(() => {
    resetState();
  }, [resetState]);

  const handleSuccessDismiss = (): void => {
    resetState();
    navigation.goBack();
  };

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    loading,
    saving,
    error,
    success,
    message,
    camera,
    selectedCategory,
    fetchExpense,
    createExpense,
    updateExpense,
    handleRemovePhoto,
    clearError,
    handleSuccessDismiss
  };
}
