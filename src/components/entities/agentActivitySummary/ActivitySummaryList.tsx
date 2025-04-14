import React from 'react';
import { List, Text } from 'react-native-paper';
import { AgentActivitySummary } from '@/types/agentActivitySummary';
import { formatCurrency } from '@/utils/formatters';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '@/navigation/types';
import { FilterField, FilterOperator } from '@/types/core';
import { convertToISTDate } from '@/utils/dateUtils';
import { FilterReturnType } from '@/types/commonFilter';
import moment from 'moment';

interface ActivitySummaryListProps {
    summary: AgentActivitySummary | null;
    loading?: boolean;
    title: string;
    period: 'today' | 'month';
}

type NavigationProp = DrawerNavigationProp<RootStackParamList>;

export default function ActivitySummaryList({ summary, loading, title, period }: ActivitySummaryListProps) {

    const navigation = useNavigation<NavigationProp>();

    const handleNavigate = (drawerScreen: string, nestedScreen: string) => {
        let field: FilterReturnType;

        switch (nestedScreen) {
            case 'SalesOrderList':
                field = FilterReturnType.DATE_DROPDOWN_SALES_ORDER_KEY;
                break;
            case 'DeliveryList':
                field = FilterReturnType.DATE_DROPDOWN_DELIVERY_KEY;
                break;
            case 'PaymentList':
                field = FilterReturnType.DATE_DROPDOWN_PAYMENT_KEY;
                break;
            case 'DealerList':
                field = FilterReturnType.DATE_DROPDOWN_DEALER_KEY;
                break;
            default:
                return;
        }

        const filters = getDateFilter(field);

        navigation.navigate(drawerScreen, {
            screen: nestedScreen,
            params: { filters },
        });
    };

    const getDateFilter = (field: FilterReturnType): FilterField[] => {
        const today = convertToISTDate(new Date());

        if (period === 'today') {
            return [
                {
                    field,
                    operator: FilterOperator.EQ,
                    value: today,
                },
            ];
        } else if (period === 'month') {
            const start = convertToISTDate(moment().startOf('month').toDate());
            const end = convertToISTDate(moment().endOf('month').toDate());

            return [
                {
                    field,
                    operator: FilterOperator.GTE,
                    value: start,
                },
                {
                    field,
                    operator: FilterOperator.LTE,
                    value: end,
                },
            ];
        }

        return [];
    };

    return (
        <List.Section>
            <List.Subheader>{title}</List.Subheader>

            <List.Item
                title="Sales Orders"
                description={`${summary?.salesOrderCount || 0} orders (${formatCurrency(summary?.salesOrderValue || 0)})`}
                left={props => <List.Icon {...props} icon="shopping" />}
                onPress={() => handleNavigate('Sales Orders', 'SalesOrderList')}
            />

            <List.Item
                title="Deliveries"
                description={`Full: ${summary?.fullDeliveryCount || 0}, Partial: ${summary?.partialDeliveryCount || 0}`}
                left={props => <List.Icon {...props} icon="truck-delivery" />}
                onPress={() => handleNavigate('Deliveries', 'DeliveryList')}
            />

            <List.Item
                title="Payments"
                description={`${summary?.paymentCount || 0} collections (${formatCurrency(summary?.paymentCollected || 0)})`}
                left={props => <List.Icon {...props} icon="cash" />}
                onPress={() => handleNavigate('Payments', 'PaymentList')}
            />

            <List.Item
                title="Dealers"
                description={`${summary?.dealerCount || 0} dealers created`}
                left={props => <List.Icon {...props} icon="account-group" />}
                onPress={() => handleNavigate('Dealers', 'DealerList')}
            />
        </List.Section>
    );
}
