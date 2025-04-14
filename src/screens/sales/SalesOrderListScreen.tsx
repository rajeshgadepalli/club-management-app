import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { FAB, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import SearchBar from '@/components/common/SearchBar';
import CommonFilterModal from '@/components/common/CommonFilterModal';
import SalesOrderCard from '@/components/entities/sales/SalesOrderCard';
import { FilterFieldLabelValue, FilterReturnType } from '@/types/commonFilter';
import { Dealer } from '@/types/dealer';
import { appStyles } from '@/theme/styles.new';
import { useSalesOrderList } from '@/hooks/salesOrders/list/useSalesOrderList';
import LoadingScreen from '@/components/common/LoadingScreen';
import ErrorMessage from '@/components/common/ErrorMessage';

interface RouteParams {
  dealer?: Dealer;
}

export default function SalesOrderListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { dealer } = (route.params || {}) as RouteParams;

  const {
    salesOrders,
    loading,
    error,
    hasMore,
    searchQuery,
    showFilter,
    showDateDropdown,
    handleSearch,
    handleFilter,
    handleAddOrder,
    handleRefresh,
    handleEndReached,
    setShowFilter,
    clearError
  } = useSalesOrderList(dealer);

  const filterConfig = [
    {
      label: FilterFieldLabelValue.DATE_DROPDOWN,
      value: showDateDropdown,
      returnKey: FilterReturnType.DATE_DROPDOWN_SALES_ORDER_KEY,
    },
  ];

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => clearError()}
      />
    );
  }

  if (loading && !hasMore) {
    return <LoadingScreen />;
  }

  return (
    <View style={appStyles.containerFluid}>
      <View style={appStyles.searchContainer}>
        <View style={appStyles.col}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search sales orders..."
          />
        </View>
        <IconButton
          icon="filter-variant"
          onPress={() => setShowFilter(true)}
        />
      </View>

      <FlatList
        data={salesOrders}
        renderItem={({ item }) => (
          <SalesOrderCard
            salesOrder={item}
          />
        )}
        keyExtractor={item => item.id.toString()}
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
            <LoadingScreen />
          ) : null
        }
      />

      <FAB
        icon="plus"
        style={appStyles.fab}
        onPress={handleAddOrder}
      />

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
