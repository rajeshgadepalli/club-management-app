import { useState, useCallback, useMemo } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FilterField, FilterOperator } from "@/types/core";
import { useUnplannedActivity } from "../api/useUnplannedActivity";
import { UnplannedActivityLite } from "@/types/unplannedActivity";
import { UnplannedActivityStackParamList } from "@/navigators/UnplannedActivityStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FilterReturnType } from "@/types/commonFilter";

export function useUnplannedActivitiesList() {
  const navigation =
    useNavigation<NativeStackNavigationProp<UnplannedActivityStackParamList>>();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterField[]>([]);
  const [page, setPage] = useState(0);

  const {
    activities: originalActivities,
    loading,
    error,
    hasMore,
    fetchActivities,
  } = useUnplannedActivity();

  const filteredActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const uniqueActivities = originalActivities.filter(
      (item, index, self) =>
        item?.id != null && self.findIndex((a) => a.id === item.id) === index
    );

    if (!query) return uniqueActivities;

    return uniqueActivities.filter((activity) =>
      [
        activity.firstName,
        activity.lastName,
        activity.unplannedActivityCategory,
        activity.comments,
      ]
        .filter(Boolean)
        .some((val) => val?.toLowerCase().includes(query))
    );
  }, [originalActivities, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRefresh = useCallback(() => {
    setPage(0);
    fetchActivities(filters, false);
  }, [filters, fetchActivities]);

  const handleEndReached = useCallback(() => {
    if (!loading && hasMore && !searchQuery.trim()) {
      setPage((prev) => prev + 1);
      fetchActivities(filters, true); // load more
    }
  }, [loading, hasMore, searchQuery, filters, fetchActivities]);

  useFocusEffect(
    useCallback(() => {
      setPage(0);
      fetchActivities(filters, false);
    }, [filters, fetchActivities])
  );

  const handleFilter = useCallback(
    (filterValues: any) => {
      const apiFilters: FilterField[] = [];

      if (filterValues.fromDate && filterValues.toDate) {
        apiFilters.push({
          field: FilterReturnType.DATE_DROPDOWN_UNPLANNED_ACTIVITY_KEY,
          operator: FilterOperator.GTE,
          value: filterValues.fromDate,
        });
        apiFilters.push({
          field: FilterReturnType.DATE_DROPDOWN_UNPLANNED_ACTIVITY_KEY,
          operator: FilterOperator.LTE,
          value: filterValues.toDate,
        });
      }

      setFilters(apiFilters);
      fetchActivities(apiFilters, false);
    },
    [fetchActivities]
  );
  const handleEditActivity = useCallback(
    (activity: UnplannedActivityLite) => {
      navigation.navigate("UnplannedActivityForm", { activity });
    },
    [navigation]
  );

  const handleAddActivity = useCallback(() => {
    navigation.navigate("UnplannedActivityForm");
  }, [navigation]);

  return {
    hasMore,
    activities: filteredActivities,
    loading,
    error,
    searchQuery,
    handleSearch,
    handleRefresh,
    handleEndReached,
    handleEditActivity,
    handleAddActivity,
    handleFilter,
  };
}
