import React from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { FAB, IconButton } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";

import SearchBar from "@/components/common/SearchBar";
import CommonFilterModal from "@/components/common/CommonFilterModal";
import SalesReturnCard from "@/components/entities/salesReturns/SalesReturnCard";

import { FilterFieldLabelValue, FilterReturnType } from "@/types/commonFilter";
import { Dealer } from "@/types/dealer";
import { appStyles } from "@/theme/styles.new";
import { useSalesReturnList } from "@/hooks/salesReturn/list/useSalesReturnList";

import LoadingScreen from "@/components/common/LoadingScreen";
import ErrorMessage from "@/components/common/ErrorMessage";

interface RouteParams {
  dealer?: Dealer;
}

export default function SalesReturnListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { dealer } = (route.params || {}) as RouteParams;

  const {
    salesReturns,
    loading,
    error,
    hasMore,
    searchQuery,
    showFilter,
    showDateDropdown,
    handleSearch,
    handleFilter,
    handleAddReturn,
    handleRefresh,
    handleEndReached,
    setShowFilter,
    clearError,
  } = useSalesReturnList(dealer);

  const filterConfig = [
    {
      label: FilterFieldLabelValue.DATE_DROPDOWN,
      value: showDateDropdown,
      returnKey: FilterReturnType.DATE_DROPDOWN_SALES_ORDER_KEY, // should be "returnDate"
    },
  ];

  if (error) {
    return <ErrorMessage message={error} onRetry={clearError} />;
  }

  if (loading && !hasMore) {
    return <LoadingScreen />;
  }

  // ✅ Remove duplicates
  const uniqueReturns = Array.from(
    new Map(salesReturns.map((item) => [item.id, item])).values()
  );

  return (
    <View style={appStyles.containerFluid}>
      <View style={appStyles.searchContainer}>
        <View style={appStyles.col}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search sales returns..."
          />
        </View>
        <IconButton icon="filter-variant" onPress={() => setShowFilter(true)} />
      </View>

      <FlatList
        data={uniqueReturns}
        renderItem={({ item }) => <SalesReturnCard salesReturn={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={appStyles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading && !hasMore}
            onRefresh={handleRefresh}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && hasMore ? <LoadingScreen /> : null}
      />

      <FAB icon="plus" style={appStyles.fab} onPress={handleAddReturn} />

      <CommonFilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApplyFilter={handleFilter}
        filterFieldsConfig={filterConfig}
      >
        <View />
      </CommonFilterModal>
    </View>
  );
}
