import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/formatters';
import LoadingButton from '@/components/common/LoadingButton';
import LoadingScreen from '@/components/common/LoadingScreen';
import ErrorMessage from '@/components/common/ErrorMessage';
import SuccessAlert from '@/components/common/SuccessAlert';
import { useDeliveryForm } from '@/hooks/deliveries/form/useDeliveryForm';
import { appStyles } from '@/theme/styles.new';
import { DeliveryStatusType } from '@/types/delivery';

const DeliveryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: number };

  const {
    delivery,
    loading,
    saving,
    error,
    success,
    message,
    clearError,
    handleConfirmDelivery,
  } = useDeliveryForm(id);

  if (loading) return <LoadingScreen />;

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
        {/* Dealer Details */}
        <View style={appStyles.card}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>Dealer Details</Text>
          <View style={appStyles.gap}>
            <View style={appStyles.rowBetween}>
              <Text>Name:</Text>
              <Text>{delivery?.salesOrder.dealer.dealerName}</Text>
            </View>
            <View style={appStyles.rowBetween}>
              <Text>Phone:</Text>
              <Text>{delivery?.salesOrder.dealer.dealerMobileNo}</Text>
            </View>
            <View style={appStyles.rowBetween}>
              <Text>Address:</Text>
              <Text>{delivery?.deliveryAddress}</Text>
            </View>
          </View>
        </View>

        {/* Order Details */}
        <View style={appStyles.card}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>Order Details</Text>
          <View style={appStyles.gap}>
            <View style={appStyles.rowBetween}>
              <Text>Order ID:</Text>
              <Text>{delivery?.salesOrder.orderNo}</Text>
            </View>
            <View style={appStyles.rowBetween}>
              <Text>Order Date:</Text>
              <Text>{formatDate(delivery?.salesOrder?.orderDate as Date)}</Text>
            </View>
            <View style={appStyles.rowBetween}>
              <Text>Total Amount:</Text>
              <Text>{formatCurrency(delivery?.salesOrder.totalAmount as number)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Items */}
        <View style={appStyles.card}>
          <Text variant="titleMedium" style={appStyles.formSectionTitle}>Delivery Items</Text>
          <View style={appStyles.gap}>
            {delivery?.deliveryItems.map((item, index) => (
              <View key={item.id}>
                <View style={appStyles.rowBetween}>
                  <Text style={appStyles.col}>{item.product.name}</Text>
                  <Text>Qty: {item.quantityOrdered}</Text>
                </View>
                {index < delivery.deliveryItems.length - 1 && <Divider style={appStyles.divider} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {(delivery?.deliveryStatus === DeliveryStatusType.IN_PROGRESS ||
        delivery?.deliveryStatus === DeliveryStatusType.DELIVERY_VERIFICATION_FAILED) && (
          <View style={appStyles.buttonContainer}>
            <LoadingButton
              mode="contained"
              onPress={() => handleConfirmDelivery()}
              loading={saving}
              style={appStyles.col}
            >
              Confirm Delivery
            </LoadingButton>
          </View>
        )}

      {success && message && (
        <SuccessAlert
          visible={true}
          message={message}
          onDismiss={() => {
            navigation.goBack();
          }}
        />
      )}
    </View>
  );
};

export default DeliveryScreen;
