import React, { useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FAB, IconButton, Text } from "react-native-paper";

import SearchBar from "@/components/common/SearchBar";
import UnplannedActivityCard from "@/components/entities/UnplannedActivities/UnplannedActivityCard";
import { useUnplannedActivitiesList } from "@/hooks/unplannedActivities/list/useUnplannedActivitiesList";
import { appStyles } from "@/theme/styles.new";
import CommonFilterModal from "@/components/common/CommonFilterModal";
import { FilterFieldLabelValue, FilterReturnType } from "@/types/commonFilter";

export default function UnplannedActivityListScreen() {
  const [showFilter, setShowFilter] = useState(false);

  const {
    hasMore,
    activities,
    loading,
    searchQuery,
    handleSearch,
    handleAddActivity,
    handleRefresh,
    handleEndReached,
    handleFilter,
  } = useUnplannedActivitiesList();

  const filterConfig = [
    {
      label: FilterFieldLabelValue.DATE_DROPDOWN,
      value: true,
      returnKey: FilterReturnType.DATE_DROPDOWN_UNPLANNED_ACTIVITY_KEY,
    },
  ];

  return (
    <View style={appStyles.containerFluid}>
      <View style={appStyles.searchContainer}>
        <View style={appStyles.col}>
          <SearchBar
            placeholder="Search activities..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <IconButton icon="filter-variant" onPress={() => setShowFilter(true)} />
      </View>

      <FlatList
        data={activities}
        renderItem={({ item }) => <UnplannedActivityCard activity={item} />}
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
        ListEmptyComponent={
          <View style={appStyles.listContainer}>
            <Text>No unplanned activities found</Text>
          </View>
        }
        ListFooterComponent={
          loading && hasMore ? (
            <ActivityIndicator style={appStyles.loadingContainer} />
          ) : null
        }
      />

      <FAB icon="plus" style={appStyles.fab} onPress={handleAddActivity} />

      <CommonFilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApplyFilter={(filters) => {
          handleFilter(filters);
          setShowFilter(false);
        }}
        filterFieldsConfig={filterConfig}
      >
        <View />
      </CommonFilterModal>
    </View>
  );
}
