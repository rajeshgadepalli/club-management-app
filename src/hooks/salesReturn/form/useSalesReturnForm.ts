import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { SalesReturnForm, salesReturnSchema } from "@/schemas/salesReturn";
import { useSalesReturn } from "../api/useSalesReturn";
import { useLoggedinUserData } from "@/hooks/api/useLoggedinUserData";
import { useDealer } from "@/hooks/dealers/api/useDealer";
import { useLookup } from "@/hooks/api/useLookup";

import { Dealer, DealerLite } from "@/types/dealer";
import { FilterField, FilterOperator, Lookup } from "@/types/core";
import { SalesReturn } from "@/types/salesReturn";
import { UserInfo } from "@/types/user";

export function useSalesReturnForm() {
  const { user } = useLoggedinUserData();
  const { createSalesReturn, saving, success, message, error, resetState } =
    useSalesReturn();
  const { dealers, fetchDealers } = useDealer();
  const { fetchLookupsByCategories } = useLookup();

  const [showDealerLookup, setShowDealerLookup] = useState(false);
  const [selectedDealer, setDealer] = useState<DealerLite | null>(null);
  const [lookupReasons, setLookupReasons] = useState<Lookup[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SalesReturnForm>({
    resolver: yupResolver(salesReturnSchema),
    defaultValues: {
      dealer: undefined,
      reason: undefined,
      returnDate: new Date().toISOString(),
      totalAmount: 0,
    },
  });

  // 🔁 Submit Logic
  const onSubmit = async (data: SalesReturnForm) => {
    if (!user) return;

    const payload: Partial<SalesReturn> = {
      dealer: data.dealer as Dealer,
      reason: {
        id: data.reason.id,
        lookupValue: data.reason.lookupValue,
        uniqueKey: data.reason.uniqueKey,
        category: data.reason.category,
      } as Lookup,
      returnTakenBy: { id: user.id } as UserInfo,
      returnDate: new Date(data.returnDate).toISOString(),
      totalAmount: data.totalAmount,
      salesReturnItems: [],
    };

    try {
      await createSalesReturn(payload);
    } catch (err) {
      console.error("Error creating Sales Return", err);
    }
  };

  // 🔍 Dealer Search
  const dealerSearchFn = async (query: string): Promise<DealerLite[]> => {
    const filters: FilterField[] = [
      { field: "dealerName", operator: FilterOperator.CONTAINS, value: query },
    ];
    await fetchDealers(filters);
    return dealers;
  };

  // 🎯 Fetch Sales Return Reasons from Lookup
  const fetchReasons = useCallback(async () => {
    try {
      const result = await fetchLookupsByCategories(["SALES_RETURN_REASON"]);
      setLookupReasons(result);
    } catch (err) {
      console.error("Failed to fetch Sales Return reasons:", err);
    }
  }, [fetchLookupsByCategories]);

  useEffect(() => {
    fetchReasons();
  }, [fetchReasons]);

  // 🎯 Format Reason Options for Dropdown
  const reasonOptions = useMemo(
    () =>
      lookupReasons.map((item) => ({
        label: item.lookupValue,
        value: item.id.toString(),
      })),
    [lookupReasons]
  );

  const clearError = useCallback(() => {
    resetState();
  }, [resetState]);

  return {
    control,
    handleSubmit,
    onSubmit,
    errors,
    saving,
    success,
    message,
    error,
    clearError,
    showDealerLookup,
    setShowDealerLookup,
    dealerSearchFn,
    selectedDealer,
    setDealer,
    reasonOptions,
    lookupReasons,
    setValue,
  };
}
