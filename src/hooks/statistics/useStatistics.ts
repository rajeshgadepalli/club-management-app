import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '@/services/api/statistics/statisticsService';
import { Statistics, StatisticsPeriod } from '@/types/statistics';

export function useStatistics(period: StatisticsPeriod) {
  const queryKey = ['statistics', period];
  
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => 
      period === 'today' 
        ? statisticsService.getTodayStatistics()
        : statisticsService.getMonthStatistics(),
  });

  return {
    statistics: data,
    isLoading,
    error,
  };
}
