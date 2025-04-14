import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, Button, IconButton } from "react-native-paper";
import { Controller } from "react-hook-form";
import { DealerLite } from "@/types/dealer";
import { Product } from "@/types/core";
import TextField from "@/components/common/CustomTextField";
import { useWatch } from "react-hook-form";
import { appStyles } from "@/theme/styles.new";
import { formatCurrency } from "@/utils/formatters";
import LoadingButton from "@/components/common/LoadingButton";
import ErrorMessage from "@/components/common/ErrorMessage";
import { SalesOrderForm } from "@/schemas/salesOrder";
import { useSalesOrderForm } from "@/hooks/salesOrders/form/useSalesOrderForm";
import {
  EntityLookup,
  SelectedEntityCard,
} from "@/components/common/EntityLookup";
import LoadingScreen from "@/components/common/LoadingScreen";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export default function SalesOrderFormScreen({ route }: any) {
  const dealerId = route?.params?.dealerId; // Get dealerId from navigation params

  const {
    control,
    errors,
    error,
    handleSubmit,
    onSubmit,
    watch,
    fields,
    appendProduct,
    removeProduct,
    setDealer,
    setShowDealerLookup,
    showDealerLookup,
    setShowProductLookup,
    showProductLookup,
    message,
    success,
    saving,
    dealerSearchFn,
    productSearchFn,
    clearError,
    loading,
    handleSuccessDismiss,
    handleSuccessPayment,
    handleCancel,
  } = useSalesOrderForm(dealerId);

  if (loading) {
    return <LoadingScreen />;
  }

  const watchItems = useWatch({
    control,
    name: 'salesOrderItems',
    defaultValue: [],
  }) as SalesOrderForm['salesOrderItems'];

  const [totals, setTotals] = useState({ totalAmount: 0, taxAmount: 0, grandTotal: 0 });

  useEffect(() => {
    const items = watchItems || [];

    const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice ?? 0) * (item.quantity ?? 0), 0);
    const taxAmount = items.reduce((sum, item) => sum + (item.taxAmount ?? 0), 0);
    const grandTotal = totalAmount + taxAmount;

    setTotals({ totalAmount, taxAmount, grandTotal });
  }, [watchItems]);

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => clearError()}
      />
    );
  }

  const renderDealerSection = () => (
    <View style={appStyles.card}>
      <Text variant="titleMedium" style={appStyles.formSectionTitle}>Dealer</Text>
      <Controller
        control={control}
        name="dealer"
        render={({ field: { onChange, value } }) => (
          <>
            <SelectedEntityCard<DealerLite>
              value={value as DealerLite}
              onClear={() => {
                setDealer(null);
                onChange(null);
              }}
              entityType="Dealer"
              displayFields={[
                { key: 'dealerName', label: 'Name' },
                { key: 'firmName', label: 'Firm' }
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
                setDealer(dealer);
                onChange(dealer);
              }}
              displayFields={[{ key: 'dealerName' }, { key: 'firmName' }]}
              placeholder="Search by dealer name..."
            />
          </>
        )}
      />
    </View>
  );

  const renderProductList = (watchedItems: SalesOrderForm['salesOrderItems']) => {
    return (
      <View style={appStyles.card}>
        <View style={appStyles.cardHeader}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>Products</Text>
          <Button
            mode="outlined"
            onPress={() => setShowProductLookup(true)}
          >
            Add Product
          </Button>
        </View>

        <View style={appStyles.gap}>
          {fields.map((field, index) => {
            const item = watchedItems[index];
            const quantity = item?.quantity ?? 0;
            const unitPrice = item?.unitPrice ?? 0;

            return (
              <View key={field.id} style={[appStyles.card, { marginBottom: 0 }]}>
                <View style={appStyles.rowBetween}>
                  <Text>{item?.product?.name || 'Unnamed Product'}</Text>
                  <IconButton icon="delete" onPress={() => removeProduct(index)} />
                </View>

                <View style={appStyles.rowBetween}>
                  <Controller
                    control={control}
                    name={`salesOrderItems.${index}.quantity`}
                    render={({ field: qtyField }) => (
                      <TextField
                        label="Qty"
                        keyboardType="numeric"
                        value={String(qtyField.value ?? '')}
                        onChangeText={(val) => qtyField.onChange(Number(val))}
                      />
                    )}
                  />
                  <Text>Unit {formatCurrency(unitPrice)}</Text>
                  <Text>Total {formatCurrency(unitPrice * quantity)}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {errors.salesOrderItems && (
          <Text style={appStyles.error}>{errors.salesOrderItems.message}</Text>
        )}

        <EntityLookup<Product>
          visible={showProductLookup}
          onClose={() => setShowProductLookup(false)}
          searchFn={productSearchFn}
          onSelect={(product) => {
            appendProduct(product);
            setShowProductLookup(false);
          }}
          displayFields={[{ key: 'name' }]}
          placeholder="Search by product name..."
        />
      </View>
    );
  };

  const renderFooter = () => (
    <View style={appStyles.card}>
      <View style={appStyles.gap}>
        <View style={appStyles.rowBetween}>
          <Text>Total Amount:</Text>
          <Text>{formatCurrency(totals.totalAmount)}</Text>
        </View>
        <View style={appStyles.rowBetween}>
          <Text>Total Tax:</Text>
          <Text>{formatCurrency(totals.taxAmount)}</Text>
        </View>
        <View style={[appStyles.rowBetween, appStyles.divider, { paddingTop: 8 }]}>
          <Text variant="titleMedium">Grand Total:</Text>
          <Text variant="titleMedium">{formatCurrency(totals.grandTotal)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={appStyles.containerFluid}>
      <ScrollView
        style={appStyles.container}
        contentContainerStyle={{ ...appStyles.formScrollContent, paddingBottom: 80 }}
      >
        <View style={appStyles.card}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>
            Dealer Details
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
                      setDealer(null);
                      onChange(null);
                    }}
                    entityType="Dealer"
                    displayFields={[
                      { key: 'dealerName', label: 'Name' },
                      { key: 'firmName', label: 'Firm' }
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
                      setDealer(dealer);
                      onChange(dealer);
                    }}
                    displayFields={[{ key: 'dealerName' }, { key: 'firmName' }]}
                    placeholder="Search by dealer name..."
                  />
                </>
              )}
            />
          </View>
        </View>
        {renderProductList(watchItems)}
        {renderFooter()}
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
            disabled={saving}
            style={appStyles.col}
          >
            Save Order
          </LoadingButton>
        </View>
      </View>

      {success && message && (
        <ConfirmationDialog
          visible={true}
          title={message}
          message="Do you want to make Payment?"
          onConfirm={handleSuccessPayment}
          onCancel={handleSuccessDismiss}
        />
      )}
    </View>
  );
}
