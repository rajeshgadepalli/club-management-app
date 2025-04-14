import React from 'react';
import { View } from 'react-native';
import { Card, Text, TouchableRipple } from 'react-native-paper';
import { CalendarDays, IndianRupee, MessageSquareText } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { PaymentLite } from '@/types/payment';
import { COLORS } from '@/theme';
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/formatters';
import { appStyles } from '@/theme/styles.new';

interface PaymentCardProps {
  payment: PaymentLite;
}

export default function PaymentCard({ payment }: PaymentCardProps) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('ViewPayment', { id: payment.id });
  };

  return (
    <Card style={appStyles.card}>
      <TouchableRipple onPress={handlePress} rippleColor={COLORS.border}>
        <View style={[appStyles.cardContent, appStyles.gap]}>
          {/* Header: Dealer + Method chip */}
          <View style={appStyles.gap}>
            <Text variant="titleMedium" numberOfLines={1}>
              {payment.dealerName || 'Dealer'}
            </Text>
            {payment.paymentMethod && (
              <View style={appStyles.chipPrimary}>
                <Text variant="labelSmall" style={appStyles.textLight}>
                  {payment.paymentMethod}
                </Text>
              </View>
            )}
          </View>

          {/* Collection Date */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <CalendarDays size={18} color={COLORS.primary} />
            <Text variant="bodyMedium">{formatDate(payment.collectionDate)}</Text>
          </View>

          {/* Amount */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <IndianRupee size={18} color={COLORS.primary} />
            <Text variant="titleMedium">{formatCurrency(payment.amount)}</Text>
          </View>

          {/* Notes */}
          {payment.notes && (
            <View style={[appStyles.row, appStyles.gapSm]}>
              <MessageSquareText size={18} color={COLORS.primary} />
              <Text variant="bodyMedium" numberOfLines={2}>
                {payment.notes}
              </Text>
            </View>
          )}
        </View>
      </TouchableRipple>
    </Card>
  );
}
