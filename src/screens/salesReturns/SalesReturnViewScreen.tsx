import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Text, Card, Divider } from "react-native-paper";
import { appStyles } from "@/theme/styles.new";
import { useSalesReturnView } from "@/hooks/salesReturn/view/useSalesReturnView";
import { formatCurrency } from "@/utils/formatters";
import { formatDate } from "@/utils/dateUtils";
import { COLORS } from "@/theme";
import ErrorMessage from "@/components/common/ErrorMessage";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function SalesReturnViewScreen() {
  const route = useRoute();
  const { id } = route.params as { id: number };
  const { salesReturn, isLoading, error, fetchSalesReturn } =
    useSalesReturnView(id);

  useEffect(() => {
    fetchSalesReturn();
  }, [fetchSalesReturn]);

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

  if (!salesReturn) {
    return (
      <View style={[appStyles.containerFluid, appStyles.center]}>
        <Text>No sales return found</Text>
      </View>
    );
  }

  return (
    <View style={appStyles.containerFluid}>
      <ScrollView
        style={appStyles.container}
        contentContainerStyle={{
          ...appStyles.formScrollContent,
          paddingBottom: 80,
        }}
      >
        <View style={appStyles.gap}>
          {/* Return Header */}
          <Card style={appStyles.card}>
            <View style={[appStyles.gap, appStyles.cardContent]}>
              <View style={appStyles.rowBetween}>
                <Text variant="titleMedium">
                  Return #{salesReturn.returnNo}
                </Text>
                <Text variant="bodyMedium">
                  {formatDate(salesReturn.returnDate)}
                </Text>
              </View>
              <Text variant="bodyMedium">
                Total: {formatCurrency(salesReturn.totalAmount)}
              </Text>
              <Text variant="bodyMedium">
                Reason:{" "}
                {salesReturn.reason ? salesReturn.reason.lookupValue : "N/A"}
              </Text>
            </View>
          </Card>

          {/* Dealer Information */}
          <Card style={appStyles.card}>
            <View style={[appStyles.gap, appStyles.cardContent]}>
              <Text variant="titleMedium">Dealer Information</Text>
              <View style={appStyles.gap}>
                <Text variant="bodyMedium">{salesReturn.dealer.firmName}</Text>
                <Text variant="bodyMedium">
                  {salesReturn.dealer.dealerName}
                </Text>
                <Text variant="bodyMedium">
                  {salesReturn.dealer.dealerMobileNo}
                </Text>
              </View>
            </View>
          </Card>

          {/* Return Taken By */}
          <Card style={appStyles.card}>
            <View style={[appStyles.gap, appStyles.cardContent]}>
              <Text variant="titleMedium">Return Taken By</Text>
              <Text variant="bodyMedium">
                {salesReturn.returnTakenBy.firstName}{" "}
                {salesReturn.returnTakenBy.lastName}
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
