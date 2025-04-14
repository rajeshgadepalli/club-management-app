import React from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { FAB, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '@/components/common/SearchBar';
import CommonFilterModal from '@/components/common/CommonFilterModal';
import PaymentCard from '@/components/entities/payments/PaymentCard';
import { FilterFieldLabelValue, FilterReturnType } from '@/types/commonFilter';
import { appStyles } from '@/theme/styles.new';
import { usePaymentList } from '@/hooks/payments/list/usePaymentList';

export default function PaymentListScreen() {
  const navigation = useNavigation();

  const {
    payments,
    loading,
    error,
    hasMore,
    searchQuery,
    showFilter,
    showDateDropdown,
    handleSearch,
    handleFilter,
    handleAddPayment,
    handleRefresh,
    handleEndReached,
    setShowFilter,
    fetchPayments
  } = usePaymentList();

  const filterConfig = [
    {
      label: FilterFieldLabelValue.DATE_DROPDOWN,
      value: showDateDropdown,
      returnKey: FilterReturnType.DATE_DROPDOWN_PAYMENT_KEY,
    },
  ];

  return (
    <View style={appStyles.containerFluid}>
      <View style={appStyles.searchContainer}>
        <View style={appStyles.col}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search payments..."
          />
        </View>
        <IconButton
          icon="filter-variant"
          onPress={() => setShowFilter(true)}
        />
      </View>

      <FlatList
        data={payments}
        renderItem={({ item }) => (
          <PaymentCard payment={item} />
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
            <ActivityIndicator style={appStyles.loadingContainer} />
          ) : null
        }
      />

      <FAB
        icon="plus"
        style={appStyles.fab}
        onPress={handleAddPayment}
      />

      <CommonFilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApplyFilter={(filters: Record<string, any>) => handleFilter(filters)}
        filterFieldsConfig={filterConfig}
      >
        <View />
      </CommonFilterModal>
    </View>
  );
}
