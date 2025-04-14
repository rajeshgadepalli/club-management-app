import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SalesOrderForm, salesOrderSchema } from "@/schemas/salesOrder";
import { useSalesOrder } from "../api/useSalesOrder";
import { useLoggedinUserData } from "@/hooks/api/useLoggedinUserData";
import { Dealer, DealerLite } from "@/types/dealer";
import { FilterOperator, Product } from "@/types/core";
import { FilterField } from "@/types/core";
import { useDealer } from "@/hooks/dealers/api/useDealer";
import { SalesOrder, SalesOrderItem } from "@/types/salesOrder";
import { UserInfo } from "@/types/user";
import { useProduct } from "@/hooks/products/api/useProduct";
import { useNavigation } from "@react-navigation/native";

export function useSalesOrderForm(dealerId?: number) {
  const { user } = useLoggedinUserData();
  const navigation = useNavigation();

  const {
    salesOrder,
    createSalesOrder,
    loading,
    saving,
    error,
    success,
    message,
    resetState,
  } = useSalesOrder();
  const {
    dealers,
    fetchDealers,
    dealer: fetchedDealer,
    fetchDealer,
    loading: dealerLoading,
  } = useDealer();
  const { products, fetchProducts } = useProduct();

  const [showDealerLookup, setShowDealerLookup] = useState(false);
  const [showProductLookup, setShowProductLookup] = useState(false);
  const [selectedDealer, setDealer] = useState<DealerLite | null>(null);

  // Add useEffect to fetch dealer when ID exists
  useEffect(() => {
    if (dealerId) {
      fetchDealer(dealerId);
    }
  }, [dealerId, fetchDealer]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SalesOrderForm>({
    resolver: yupResolver(salesOrderSchema),
    defaultValues: {
      orderDate: new Date().toISOString(),
      dealer: undefined,
      isSpotOrder: 0,
      salesOrderItems: [],
      totalAmount: 0,
      taxAmount: 0
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'salesOrderItems',
  });

  const appendProduct = (product: Product) => {
    append({
      product,
      quantity: 1,
      unitPrice: 100, // hardcoded
      discountUnitPrice: 0,
      discountPrice: 0,
      taxRate: 10,
      taxAmount: 10,
      totalPrice: 110
    });
  };

  const onSubmit = async (data: SalesOrderForm) => {
    if (!user) {
      console.error('No user found');
      return;
    }

    const orderPayload: Partial<SalesOrder> = {
      orderDate: new Date(data.orderDate),
      dealer: data.dealer ? ({ id: data.dealer.id } as Dealer) : undefined,
      orderTakenBy: { id: user.id } as UserInfo,
      isSpotOrder: data.isSpotOrder,
      taxAmount: data.taxAmount,
      totalAmount: data.totalAmount,
      salesOrderItems: data.salesOrderItems.map(item => ({
        product: { id: item.product.id } as Product,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountUnitPrice: item.discountUnitPrice,
        discountPrice: item.discountPrice,
        taxRate: item.taxRate,
        taxAmount: item.taxAmount,
        totalPrice: item.totalPrice
      } as SalesOrderItem)),
    };

    try {
      await createSalesOrder(orderPayload);
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  const dealerSearchFn = async (query: string): Promise<DealerLite[]> => {
    const filters: FilterField[] = [
      { field: 'dealerName', operator: FilterOperator.CONTAINS, value: query },
    ];
    await fetchDealers(filters);
    return dealers;
  };

  const productSearchFn = async (query: string): Promise<Product[]> => {
    const filters: FilterField[] = [
      { field: 'name', operator: FilterOperator.CONTAINS, value: query },
    ];
    await fetchProducts(filters);
    return products;
  };

  const clearError = useCallback(() => {
    resetState();
  }, [resetState]);

  const handleSuccessDismiss = (): void => {
    navigation.goBack();
    resetState();
  };

  const handleSuccessPayment = (): void => {
    navigation.navigate("Payments", {
      screen: "PaymentForm",
      params: {
        dealerId: salesOrder?.dealer?.id,
        salesOrderId: salesOrder?.id,
      },
    });
    resetState();
  };

  const convertToDealerLite = (dealer: Dealer): DealerLite => ({
    id: dealer.id,
    dealerName: dealer.dealerName,
    firmName: dealer.firmName,
    associatedUserId: dealer.associatedUser?.id || 0,
    associatedUserFirstName: dealer.associatedUser?.firstName || "",
    associatedUserLastName: dealer.associatedUser?.lastName || "",
    dealerCreatedById: dealer.dealerCreatedBy?.id || 0,
  } as DealerLite);

  const handleCancel = (): void => {
    navigation.navigate("Sales Orders", {
      screen: "SalesOrderList",
      params: {
        dealerId: salesOrder?.dealer?.id,
        salesOrderId: salesOrder?.id,
      },
    });
    resetState();
  };

  // Then use it in the useEffect
  useEffect(() => {
    if (fetchedDealer && dealerId) {
      const dealerLite = convertToDealerLite(fetchedDealer);
      setDealer(dealerLite);
      setValue("dealer", dealerLite);
    }
  }, [fetchedDealer, dealerId, setDealer, setValue]);

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
    watch,
    fields,
    resetState,
    setShowDealerLookup,
    showDealerLookup,
    setShowProductLookup,
    showProductLookup,
    setDealer,
    dealer: selectedDealer,
    appendProduct,
    removeProduct: remove,
    dealerSearchFn,
    productSearchFn,
    clearError,
    handleSuccessDismiss,
    handleSuccessPayment,
    handleCancel
  };
}
