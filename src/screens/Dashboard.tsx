import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, SegmentedButtons, Card } from 'react-native-paper';
import { COLORS, SPACING } from '@/theme';
import TimeInOutModal from '@/components/entities/attendance/TimeInOutModal';
import { useAttendance } from '@/hooks/attendance/api/useAttendance';
import { useLoggedinUserData } from '@/hooks/api/useLoggedinUserData';
import { AttendanceAction } from '@/types/attendance';
import { formatTime } from '@/utils/dateUtils';
import { useAgentActivitySummary } from '@/hooks/agentActivitySummary/useAgentActivitySummary';
import ActivitySummaryList from '@/components/entities/agentActivitySummary/ActivitySummaryList';
import { getFullName } from '@/utils/formatters';
import { appStyles } from '@/theme/styles.new';

type Period = 'today' | 'month';

export default function Dashboard() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<AttendanceAction>('timeIn');
  const [period, setPeriod] = useState<Period>('today');
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useLoggedinUserData();
  const { todayRecord, fetchTodayAttendance } = useAttendance();
  const { summary, summaries, loading, getActivitySummary, getActivitySummaryRange } = useAgentActivitySummary();

  const fetchData = useCallback(async () => {
    const today = new Date();
    try {
      if (period === 'today') {
        await getActivitySummary(today);
      } else {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        await getActivitySummaryRange(firstDayOfMonth, lastDayOfMonth);
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    }
  }, [getActivitySummary, getActivitySummaryRange, period]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchTodayAttendance();
      await fetchData();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData, fetchTodayAttendance]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [period]);

  // Initial attendance fetch
  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const handleOpenModal = (action: AttendanceAction) => {
    setCurrentAction(action);
    setModalVisible(true);
  };

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    onRefresh();
  }, [onRefresh]);

  const renderTimeInSection = () => {
    if (todayRecord?.timeIn) {
      return (
        <>
          <Text variant="titleMedium">Time In</Text>
          <Text variant="headlineSmall" style={{ color: COLORS.primary, marginVertical: SPACING.xs }}>
            {formatTime(new Date(todayRecord.timeIn))}
          </Text>
        </>
      );
    }

    return (
      <Button
        mode="contained"
        onPress={() => handleOpenModal('timeIn')}
      >
        Time In
      </Button>
    );
  };

  const renderTimeOutSection = () => {
    if (todayRecord?.timeOut) {
      return (
        <>
          <Text variant="titleMedium">Time Out</Text>
          <Text variant="headlineSmall" style={{ color: COLORS.primary, marginVertical: SPACING.xs }}>
            {formatTime(new Date(todayRecord.timeOut))}
          </Text>
        </>
      );
    }

    return (
      <Button
        mode="contained"
        onPress={() => handleOpenModal('timeOut')}
        disabled={!todayRecord?.timeIn}
      >
        Time Out
      </Button>
    );
  };

  return (
    <ScrollView
      style={appStyles.containerFluid}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      <View style={appStyles.pageHeader}>
        <Text variant="headlineLarge" style={appStyles.pageHeaderTitle}>
          {getFullName(user?.firstName || null, user?.lastName || null)}
        </Text>
        <Text variant="titleMedium" style={appStyles.pageHeaderSubtitle}>
          {user?.roleKey}
        </Text>
      </View>

      <View style={appStyles.dashboardSection}>
        <View style={appStyles.dashboardItem}>
          {renderTimeInSection()}
        </View>

        <View style={appStyles.dashboardItem}>
          {renderTimeOutSection()}
        </View>
      </View>

      <Card style={appStyles.card}>
        <SegmentedButtons
          value={period}
          onValueChange={value => setPeriod(value as Period)}
          buttons={[
            { value: 'today', label: 'Today' },
            { value: 'month', label: 'This Month' },
          ]}
          style={appStyles.dashboardSegment}
        />

        <ActivitySummaryList
          summary={period === 'today' ? summary : summaries?.[0] || null}
          loading={loading}
          title={period === 'today' ? "Today's Activity" : "Monthly Activity"}
          period={period}
        />
      </Card>

      <TimeInOutModal
        visible={modalVisible}
        onDismiss={handleCloseModal}
        action={currentAction}
      />
    </ScrollView>
  );
}