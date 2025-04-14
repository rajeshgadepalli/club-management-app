import React from "react";
import { View } from "react-native";
import { Card, Text, TouchableRipple } from "react-native-paper";
import { Calendar, User, IndianRupee } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "@/theme";
import { SalesReturnLite } from "@/types/salesReturn";
import { appStyles } from "@/theme/styles.new";
import { formatCurrency } from "@/utils/formatters";
import { formatDate } from "@/utils/dateUtils";

interface SalesReturnCardProps {
  salesReturn: SalesReturnLite;
  onPress?: () => void;
}

export default function SalesReturnCard({
  salesReturn,
  onPress,
}: SalesReturnCardProps) {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    if (onPress) return onPress();
    navigation.navigate("SalesReturnViewScreen", { id: salesReturn.id });
  };

  return (
    <Card style={appStyles.card}>
      <TouchableRipple onPress={handlePress}>
        <View style={[appStyles.cardContent, appStyles.gap]}>
          <View style={appStyles.gap}>
            <Text variant="titleMedium">Return #{salesReturn.returnNo}</Text>
          </View>

          {/* Return Date */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <Calendar size={16} color={COLORS.primary} />
            <Text variant="bodyMedium">
              {formatDate(salesReturn.returnDate)}
            </Text>
          </View>

          {/* Dealer Name */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <User size={16} color={COLORS.primary} />
            <Text variant="bodyMedium" numberOfLines={1}>
              {salesReturn.dealerName}
            </Text>
          </View>

          {/* Total Amount */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <IndianRupee size={16} color={COLORS.primary} />
            <Text variant="titleMedium" numberOfLines={1}>
              {formatCurrency(salesReturn.totalAmount)}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    </Card>
  );
}
