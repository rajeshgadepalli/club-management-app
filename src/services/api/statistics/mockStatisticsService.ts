import { Statistics } from '@/types/statistics';

// Mock data for today's statistics
const todayStats: Statistics = {
  dealers: 15,
  deliveries: 8,
  orders: 23,
  payments: 18,
};

// Mock data for monthly statistics (last 30 days)
const monthlyStats: Statistics = {
  dealers: 142,
  deliveries: 95,
  orders: 287,
  payments: 234,
};

// Add some randomization to make it look more realistic
const getRandomizedStats = (baseStats: Statistics): Statistics => {
  const variation = 0.1; // 10% variation
  return {
    dealers: Math.round(baseStats.dealers * (1 + (Math.random() - 0.5) * variation)),
    deliveries: Math.round(baseStats.deliveries * (1 + (Math.random() - 0.5) * variation)),
    orders: Math.round(baseStats.orders * (1 + (Math.random() - 0.5) * variation)),
    payments: Math.round(baseStats.payments * (1 + (Math.random() - 0.5) * variation)),
  };
};

export const mockStatisticsService = {
  getTodayStatistics: async (): Promise<Statistics> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return getRandomizedStats(todayStats);
  },

  getMonthStatistics: async (): Promise<Statistics> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return getRandomizedStats(monthlyStats);
  },
};
