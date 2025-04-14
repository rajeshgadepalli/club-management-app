import React from 'react';
import { View } from 'react-native';
import { Card, Text, TouchableRipple } from 'react-native-paper';
import { CalendarDays, Package2, User } from 'lucide-react-native';
import { COLORS } from '@/theme';
import { DeliveryLite, DeliveryStatusType } from '@/types/delivery';
import { formatDate } from '@/utils/dateUtils';
import { appStyles } from '@/theme/styles.new';

interface DeliveryCardProps {
  delivery: DeliveryLite;
  onPress: () => void;
}

export default function DeliveryCard({ delivery, onPress }: DeliveryCardProps) {
  const {
    deliveryUniqueKey,
    plannedDeliveryDate,
    deliveryStatus,
    deliverTo,
    firstName,
    lastName,
    orderNo,
  } = delivery;

  const getStatusColor = (status: string) => {
    switch (status) {
      case DeliveryStatusType.DELIVERED:
      case DeliveryStatusType.DELIVERY_VERIFIED:
        return COLORS.status.success;
      case DeliveryStatusType.IN_PROGRESS:
        return COLORS.status.warning;
      case DeliveryStatusType.DELIVERY_VERIFICATION_FAILED:
        return COLORS.error;
      default:
        return COLORS.disabled;
    }
  };

  return (
    <Card style={appStyles.card}>
      <TouchableRipple onPress={onPress} rippleColor={COLORS.border}>
        <View style={[appStyles.cardContent, appStyles.gap]}>
          {/* Header */}
          <View style={appStyles.gap}>
            <Text variant="titleMedium">Order #{orderNo}</Text>
            {deliveryStatus && (
              <View
                style={[
                  appStyles.statusChip,
                  { backgroundColor: getStatusColor(deliveryStatus) },
                ]}
              >
                <Text variant="labelSmall" style={appStyles.textLight}>
                  {deliveryStatus}
                </Text>
              </View>
            )}
          </View>

          {/* Delivery Date */}
          {plannedDeliveryDate && (
            <View style={[appStyles.row, appStyles.gapSm]}>
              <CalendarDays size={18} color={COLORS.primary} />
              <Text variant="bodyMedium">
                {formatDate(new Date(plannedDeliveryDate))}
              </Text>
            </View>
          )}

          {/* Deliver To */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <Package2 size={18} color={COLORS.primary} />
            <Text variant="bodyMedium" numberOfLines={1}>
              {deliverTo}
            </Text>
          </View>

          {/* Recipient Name */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <User size={18} color={COLORS.primary} />
            <Text variant="bodyMedium" numberOfLines={1}>
              {firstName} {lastName}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    </Card>
  );
}
