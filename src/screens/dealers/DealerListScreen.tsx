import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { FAB, IconButton, Text } from 'react-native-paper';
import SearchBar from '@/components/common/SearchBar';
import CommonFilterModal from '@/components/common/CommonFilterModal';
import DealerCard from '@/components/entities/dealers/DealerCard';
import { useDealerList } from '@/hooks/dealers/list/useDealerList';
import { FilterFieldLabelValue, FilterReturnType } from '@/types/commonFilter';
import { appStyles } from '@/theme/styles.new';

export default function DealerListScreen() {
  const {
    dealers,
    loading,
    error,
    hasMore,
    searchQuery,
    showFilter,
    showDateDropdown,
    handleSearch,
    handleFilter,
    handleAddDealer,
    handleEditDealer,
    handleRefresh,
    handleEndReached,
    setShowFilter,
    fetchDealers,
  } = useDealerList();

  // Initial data fetch
  useEffect(() => {
    fetchDealers([]);
  }, [fetchDealers]);

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
            placeholder="Search dealers..."
          />
        </View>
        <IconButton
          icon="filter-variant"
          onPress={() => setShowFilter(true)}
        />
      </View>

      <FlatList
        data={dealers}
        renderItem={({ item }) => (
          <DealerCard
            dealer={item}
            onEdit={() => handleEditDealer(item.id)}
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
            <ActivityIndicator style={appStyles.loadingContainer} />
          ) : null
        }
      />

      <FAB
        icon="plus"
        style={appStyles.fab}
        onPress={handleAddDealer}
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
