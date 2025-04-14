import React from "react";
import { View } from "react-native";
import {
  Card,
  Text,
  TouchableRipple,
} from "react-native-paper";
import {
  Wallet,
  CalendarDays,
  FolderKanban,
  Tags,
} from "lucide-react-native";
import { COLORS } from "@/theme";
import { formatCurrency } from "@/utils/formatters";
import { ExpenseLite } from "@/types/expense";
import { appStyles } from "@/theme/styles.new";
import { formatDate } from "@/utils/dateUtils";

interface ExpenseCardProps {
  expense: ExpenseLite;
  onEdit: () => void;
}

export default function ExpenseCard({ expense, onEdit }: ExpenseCardProps) {
  return (
    <Card style={appStyles.card}>
      <TouchableRipple onPress={onEdit} rippleColor={COLORS.border}>
        <View style={[appStyles.cardContent, appStyles.gap]}>
          {/* Header */}
          <Text variant="titleMedium">
            {`${expense.firstName} ${expense.lastName}`}
          </Text>

          {/* Date */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <CalendarDays size={18} color={COLORS.primary} />
            <Text variant="bodyMedium">{formatDate(expense.expenseDate)}</Text>
          </View>

          {/* Amount */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <Wallet size={18} color={COLORS.primary} />
            <Text variant="bodyMedium">{formatCurrency(expense.amount)}</Text>
          </View>

          {/* Category */}
          <View style={[appStyles.row, appStyles.gapSm]}>
            <Tags size={18} color={COLORS.primary} />
            <Text variant="bodyMedium" numberOfLines={1}>
              {expense.expenseCategory}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    </Card>
  );
}
