import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Card,
  Text,
  Menu,
  IconButton,
  TouchableRipple,
} from 'react-native-paper';
import { Phone, CreditCard, Building } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/theme';
import { DealerLite } from '@/types/dealer';
import { formatCurrency } from '@/utils/formatters';
import { appStyles } from '@/theme/styles.new';

interface DealerCardProps {
  dealer: DealerLite;
  onEdit: () => void;
}

export default function DealerCard({ dealer, onEdit }: DealerCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit();
  };

  const handleNavigate = (screen: string) => {
    setMenuVisible(false);
    navigation.navigate(screen as never, { dealer } as never);
  };

  return (
    <Card style={appStyles.card}>
      <TouchableRipple onPress={handleEdit} rippleColor={COLORS.border}>
        <View style={[appStyles.cardContent, appStyles.gap]}>
          {/* Header: Name + Firm + Menu */}
          <View style={appStyles.rowBetween}>
            <View style={appStyles.gapSm}>
              <Text variant="titleMedium">{dealer.dealerName}</Text>
              {dealer.firmName && (
                <View style={[appStyles.row, appStyles.gapSm]}>
                  <Building size={18} color={COLORS.accent} />
                  <Text variant="bodyMedium" numberOfLines={1}>
                    {dealer.firmName}
                  </Text>
                </View>
              )}
            </View>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              <Menu.Item onPress={handleEdit} title="Edit" />
              <Menu.Item onPress={() => handleNavigate('SalesOrderList')} title="View Sales Orders" />
              <Menu.Item onPress={() => handleNavigate('PaymentList')} title="View Payments" />
            </Menu>
          </View>

          {/* Contact */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <Phone size={18} color={COLORS.primary} />
            <Text variant="bodyMedium" numberOfLines={1}>
              {dealer.dealerMobileNo}
            </Text>
          </View>

          {/* Credit Limit */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <CreditCard size={18} color={COLORS.primary} />
            <Text variant="titleMedium">{formatCurrency(dealer.dealerCreditLimit)}</Text>
          </View>
        </View>
      </TouchableRipple>
    </Card>
  );
}