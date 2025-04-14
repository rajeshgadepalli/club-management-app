import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Text, Card } from 'react-native-paper';
import { appStyles } from '@/theme/styles.new';
import { usePaymentView } from '@/hooks/payments/view/usePaymentView';
import { formatCurrency } from '@/utils/formatters';
import { formatDate } from '@/utils/dateUtils';
import { COLORS } from '@/theme';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function PaymentViewScreen() {
    const route = useRoute();
    const { id } = route.params as { id: number };
    const { payment, isLoading, error, fetchPayment } = usePaymentView(id);

    useEffect(() => {
        fetchPayment();
    }, [fetchPayment]);

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

    if (!payment) {
        return (
            <View style={[appStyles.containerFluid, appStyles.center]}>
                <Text>No payment found</Text>
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

                    {/* Dealer Information */}

                    <Card style={appStyles.card}>
                        <View style={[appStyles.gap, appStyles.cardContent]}>
                            <Text variant="titleMedium">Dealer Information</Text>
                            <View style={appStyles.gap}>

                                {payment.dealer?.dealerName && (
                                    <View style={appStyles.rowBetween}>
                                        <Text variant="bodyMedium">Dealer Name</Text>
                                        <Text variant="bodyMedium">{payment.dealer.dealerName}</Text>
                                    </View>
                                )}

                                {payment.dealer?.dealerMobileNo && (
                                    <View style={appStyles.rowBetween}>
                                        <Text variant="bodyMedium">Mobile No</Text>
                                        <Text variant="bodyMedium">{payment.dealer.dealerMobileNo}</Text>
                                    </View>
                                )}

                                {payment.collectionDate && (
                                    <View style={appStyles.rowBetween}>
                                        <Text variant="bodyMedium">Payment Date</Text>
                                        <Text variant="bodyMedium">{formatDate(payment.collectionDate)}</Text>
                                    </View>
                                )}

                            </View>
                        </View>
                    </Card>

                    {/* Payment Details */}
                    <Card style={appStyles.card}>
                        <View style={[appStyles.gap, appStyles.cardContent]}>
                            <Text variant="titleMedium">Payment Details</Text>
                            <View style={appStyles.gap}>
                                <View style={appStyles.rowBetween}>
                                    <Text variant="bodyMedium">Payment Mode</Text>
                                    <View style={[appStyles.statusChip, { backgroundColor: COLORS.status.success }]}>
                                        <Text variant="labelSmall" style={appStyles.textLight}>
                                            {payment.paymentMethod.lookupValue}
                                        </Text>
                                    </View>
                                </View>
                                {payment.collectionDate && (
                                    <View style={appStyles.rowBetween}>
                                        <Text variant="bodyMedium">Payment Date</Text>
                                        <Text variant="bodyMedium">{formatDate(payment.collectionDate)}</Text>
                                    </View>
                                )}
                                <View style={appStyles.rowBetween}>
                                    <Text variant="bodyMedium">Amount</Text>
                                    <Text variant="bodyMedium">{formatCurrency(payment.amount)}</Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    {/* Collected By */}
                    <Card style={appStyles.card}>
                        <View style={[appStyles.gap, appStyles.cardContent]}>
                            <Text variant="titleMedium">Collected By</Text>
                            <Text variant="bodyMedium">
                                {payment.paymentCollectedBy.firstName} {payment.paymentCollectedBy.lastName}
                            </Text>
                        </View>
                    </Card>

                    {/* Notes */}
                    {payment.notes && (
                        <Card style={appStyles.card}>
                            <View style={[appStyles.gap, appStyles.cardContent]}>
                                <Text variant="titleMedium">Notes</Text>
                                <Text variant="bodyMedium">{payment.notes}</Text>
                            </View>
                        </Card>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
