import React from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDeliveryList } from '@/hooks/deliveries/list/useDeliveryList';
import DeliveryCard from '@/components/entities/deliveries/DeliveryCard';
import CommonFilterModal from '@/components/common/CommonFilterModal';
import SearchBar from '@/components/common/SearchBar';
import { COLORS } from '@/theme';
import { FilterFieldLabelValue, FilterReturnType } from '@/types/commonFilter';
import { DeliveryStatusType } from '@/types/delivery';
import { appStyles } from '@/theme/styles.new';

export default function DeliveryListScreen() {
  const {
    deliveries,
    loading,
    error,
    hasMore,
    searchQuery,
    showFilter,
    showDateDropdown,
    commonFilter,
    handleSearch,
    handleFilter,
    handleViewDelivery,
    handleRefresh,
    handleEndReached,
    setShowFilter,
  } = useDeliveryList();

  const navigation = useNavigation();

  const filterOptions = [
    { label: 'Pending', value: DeliveryStatusType.PENDING },
    { label: 'In Progress', value: DeliveryStatusType.IN_PROGRESS },
    { label: 'Delivered', value: DeliveryStatusType.DELIVERED },
    { label: 'Partially Delivered', value: DeliveryStatusType.PARTIALLY_DELIVERED },
    { label: 'Full Return', value: DeliveryStatusType.FULL_RETURN },
  ];

  const filterConfig = [
    {
      label: FilterFieldLabelValue.DATE_DROPDOWN,
      value: showDateDropdown,
      returnKey: FilterReturnType.DATE_DROPDOWN_DELIVERY_KEY,
    },
    {
      label: 'Delivery Status',
      value: commonFilter?.status,
      options: filterOptions,
      returnKey: 'status',
    },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <DeliveryCard
      delivery={item}
      onPress={() => handleViewDelivery(item.id)}
    />
  );

  const renderFooter = () => {
    if (!loading || !hasMore) return null;
    return (
      <View style={appStyles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  return (
    <View style={appStyles.containerFluid}>
      <View style={appStyles.searchContainer}>
        <View style={appStyles.col}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search deliveries..."
          />
        </View>
        <IconButton
          icon="filter-variant"
          onPress={() => setShowFilter(true)}
        />
      </View>

      <FlatList
        data={deliveries}
        renderItem={renderItem}
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
        ListEmptyComponent={
          loading ? null : (
            <View style={appStyles.emptyState}>
              <Text>No deliveries found.</Text>
            </View>
          )
        }
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
