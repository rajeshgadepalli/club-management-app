import React, { useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FAB, IconButton } from "react-native-paper";
import SearchBar from "@/components/common/SearchBar";
import CommonFilterModal from "@/components/common/CommonFilterModal";
import { FilterFieldLabelValue, FilterReturnType } from "@/types/commonFilter";
import { appStyles } from "@/theme/styles.new";
import { useExpenseList } from "@/hooks/expenses/list/useExpenseList";
import ExpenseCard from "@/components/entities/expenses/ExpenseCard";

export default function ExpenseListScreen() {
  const {
    expenses,
    loading,
    error,
    hasMore,
    searchQuery,
    showFilter,
    showDateDropdown,
    handleSearch,
    handleFilter,
    handleAddExpense,
    handleEditExpense,
    handleRefresh,
    handleEndReached,
    setShowFilter,
    fetchExpenses,
  } = useExpenseList();

  // Initial data fetch
  useEffect(() => {
    fetchExpenses([]);
  }, [fetchExpenses]);

  const filterConfig = [
    {
      label: FilterFieldLabelValue.DATE_DROPDOWN,
      value: showDateDropdown,
      returnKey: FilterReturnType.DATE_DROPDOWN_DEALER_KEY,
    },
  ];

  return (
    <View style={appStyles.containerFluid}>
      <View style={appStyles.searchContainer}>
        <View style={appStyles.col}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search expenses..."
          />
        </View>
        <IconButton
          icon="filter-variant"
          onPress={() => setShowFilter(true)}
        />
      </View>

      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            onEdit={() => handleEditExpense(item.id)}
          />
        )}
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
        ListFooterComponent={
          loading && hasMore ? (
            <ActivityIndicator style={appStyles.loadingContainer} />
          ) : null
        }
      />

      <FAB icon="plus" style={appStyles.fab} onPress={handleAddExpense} />

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
