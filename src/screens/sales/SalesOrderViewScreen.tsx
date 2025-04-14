import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Text, Card, Divider } from 'react-native-paper';
import { appStyles } from '@/theme/styles.new';
import { useSalesOrderView } from '@/hooks/salesOrders/view/useSalesOrderView';
import { formatCurrency } from '@/utils/formatters';
import { formatDate } from '@/utils/dateUtils';
import { COLORS } from '@/theme';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function SalesOrderViewScreen() {
    const route = useRoute();
    const { id } = route.params as { id: number };
    const { salesOrder, isLoading, error, fetchSalesOrder } = useSalesOrderView(id);

    useEffect(() => {
        fetchSalesOrder();
    }, [fetchSalesOrder]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <View style={[appStyles.containerFluid, appStyles.center]}>
                <ErrorMessage message={error} />
            </View>
        );
    }

    if (!salesOrder) {
        return (
            <View style={[appStyles.containerFluid, appStyles.center]}>
                <Text>No sales order found</Text>
            </View>
        );
    }

    return (
        <View style={appStyles.containerFluid}>
            <ScrollView 
                style={appStyles.container}
                contentContainerStyle={{ ...appStyles.formScrollContent, paddingBottom: 80 }}
            >
                <View style={appStyles.gap}>
                    {/* Order Header */}
                    <Card style={appStyles.card}>
                        <View style={[appStyles.gap, appStyles.cardContent]}>
                            <View style={appStyles.rowBetween}>
                                <Text variant="titleMedium">Order #{salesOrder.orderNo}</Text>
                                <Text variant="bodyMedium">{formatDate(salesOrder.orderDate)}</Text>
                            </View>
                            <View style={appStyles.rowBetween}>
                                <Text variant="bodyMedium">Status</Text>
                                <Text variant="bodyMedium">{salesOrder.status}</Text>
                            </View>
                            {salesOrder.isSpotOrder && (
                                <Text variant="bodyMedium">Spot Order</Text>
                            )}
                        </View>
                    </Card>

                    {/* Dealer Information */}
                    <Card style={appStyles.card}>
                        <View style={[appStyles.gap, appStyles.cardContent]}>
                            <Text variant="titleMedium">Dealer Information</Text>
                            <View style={appStyles.gap}>
                                <Text variant="bodyMedium">{salesOrder.dealer.firmName}</Text>
                                <Text variant="bodyMedium">{salesOrder.dealer.dealerName}</Text>
                                <Text variant="bodyMedium">{salesOrder.dealer.dealerMobileNo}</Text>
                            </View>
                        </View>
                    </Card>

                    {/* Order Items */}
                    <Card style={appStyles.card}>
                        <View style={[appStyles.gap, appStyles.cardContent]}>
                            <Text variant="titleMedium">Order Items</Text>
                            {salesOrder.salesOrderItems.map((item, index) => (
                                <View key={item.id}>
                                    {index > 0 && <Divider style={appStyles.divider} />}
                                    <View style={appStyles.gap}>
                                        <Text variant="bodyMedium">{item.product.name}</Text>
                                        <View style={appStyles.rowBetween}>
                                            <Text variant="bodyMedium">Quantity: {item.quantity}</Text>
                                            <Text variant="bodyMedium">Unit Price: {formatCurrency(item.unitPrice)}</Text>
                                        </View>
                                        <View style={appStyles.rowBetween}>
                                            <Text variant="bodyMedium">Discount: {formatCurrency(item.discountPrice)}</Text>
                                            <Text variant="bodyMedium">Tax: {formatCurrency(item.taxAmount)}</Text>
                                        </View>
                                        <View style={appStyles.rowBetween}>
                                            <Text variant="bodyMedium">Status: {item.status}</Text>
                                            <Text variant="titleMedium">{formatCurrency(item.totalPrice)}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Card>

                    {/* Order Summary */}
                    <Card style={appStyles.card}>
                        <View style={[appStyles.gap, appStyles.cardContent]}>
                            <Text variant="titleMedium">Order Summary</Text>
                            <View style={appStyles.gap}>
                                <View style={appStyles.rowBetween}>
                                    <Text variant="bodyMedium">Total Tax</Text>
                                    <Text variant="bodyMedium">{formatCurrency(salesOrder.taxAmount)}</Text>
                                </View>
                                <View style={appStyles.rowBetween}>
                                    <Text variant="titleMedium">Total Amount</Text>
                                    <Text variant="titleMedium">{formatCurrency(salesOrder.totalAmount)}</Text>
                                </View>
                                <Divider style={appStyles.divider} />
                                <View style={appStyles.gap}>
                                    <Text variant="bodyMedium">Order taken by:</Text>
                                    <Text variant="bodyMedium">
                                        {salesOrder.orderTakenBy.firstName} {salesOrder.orderTakenBy.lastName}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}
