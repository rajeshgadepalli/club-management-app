import React from 'react';
import { View } from 'react-native';
import { Card, Text, TouchableRipple } from 'react-native-paper';
import { Calendar, CalendarDays, User, Wallet } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/theme';
import { OrderStatusType, SalesOrderLite } from '@/types/salesOrder';
import { appStyles } from '@/theme/styles.new';
import { formatCurrency } from '@/utils/formatters';
import { formatDate } from '@/utils/dateUtils';

interface SalesOrderCardProps {
    salesOrder: SalesOrderLite;
}

export default function SalesOrderCard({ salesOrder }: SalesOrderCardProps) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('ViewSalesOrder', { id: salesOrder.id });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case OrderStatusType.COMPLETED:
                return COLORS.status.success;
            case OrderStatusType.PENDING:
                return COLORS.status.warning;
            case OrderStatusType.CANCELLED:
                return COLORS.error;
            default:
                return COLORS.disabled;
        }
    };

    return (
        <Card style={appStyles.card}>
            <TouchableRipple onPress={handlePress}>
                <View style={[appStyles.cardContent, appStyles.gap]}>
                    <View style={appStyles.gap}>
                        <Text variant="titleMedium">Order #{salesOrder.orderNo}</Text>
                        <View style={[appStyles.statusChip, { backgroundColor: getStatusColor(salesOrder.orderStatus) }]}>
                            <Text variant="labelSmall" style={appStyles.textLight}>
                                {salesOrder.orderStatus}
                            </Text>
                        </View>
                    </View>

                    {/* Order Date */}
                    <View style={[appStyles.row, appStyles.gapSm]}>
                        <CalendarDays size={18} color={COLORS.primary} />
                        <Text variant="bodyMedium">{formatDate(salesOrder.orderDate)}</Text>
                    </View>

                    {/* Dealer Name */}
                    <View style={[appStyles.row, appStyles.gapSm]}>
                        <User size={18} color={COLORS.primary} />
                        <Text variant="bodyMedium" numberOfLines={1}>{salesOrder.dealerName}</Text>
                    </View>

                    {/* Total Amount */}
                    <View style={[appStyles.row, appStyles.gapSm]}>
                        <Wallet size={18} color={COLORS.primary} />
                        <Text variant="titleMedium" numberOfLines={1}>{formatCurrency(salesOrder.totalAmount)}</Text>
                    </View>
                </View>
            </TouchableRipple>
        </Card>
    );
}
