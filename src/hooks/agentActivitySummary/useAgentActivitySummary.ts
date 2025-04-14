import { useState, useCallback } from 'react';
import { AgentActivitySummary } from '@/types/agentActivitySummary';
import { agentActivitySummaryService } from '@/services/api/agentActivitySummary/agentActivitySummaryService';
import { useLoggedinUserData } from '@/hooks/api/useLoggedinUserData';

interface AgentActivitySummaryState {
    summary: AgentActivitySummary | null;
    summaries: AgentActivitySummary[];
    loading: boolean;
    error: string | null;
}

const initialState: AgentActivitySummaryState = {
    summary: null,
    summaries: [],
    loading: false,
    error: null,
};

export function useAgentActivitySummary() {
    const [state, setState] = useState<AgentActivitySummaryState>(initialState);
    const { user } = useLoggedinUserData();

    const resetState = useCallback(() => {
        setState(initialState);
    }, []);

    const getActivitySummary = useCallback(async (date: Date) => {
        if (!user?.id) {
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await agentActivitySummaryService.getActivitySummary(user.id, date);
            
            if (response.success && response.data) {
                setState(prev => ({
                    ...prev,
                    summary: response.data,
                    loading: false,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    error: 'Failed to fetch activity summary',
                    loading: false,
                }));
            }
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                error: error.response?.data?.message || 'Failed to fetch activity summary',
                loading: false,
            }));
        }
    }, [user?.id]);

    const getActivitySummaryRange = useCallback(async (fromDate: Date, toDate: Date) => {
        if (!user?.id) {
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await agentActivitySummaryService.getActivitySummaryRange(user.id, fromDate, toDate);
            
            if (response.success && response.data) {
                setState(prev => ({
                    ...prev,
                    summaries: response.data,
                    loading: false,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    error: 'Failed to fetch activity summaries',
                    loading: false,
                }));
            }
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                error: error.response?.data?.message || 'Failed to fetch activity summaries',
                loading: false,
            }));
        }
    }, [user?.id]);

    return {
        ...state,
        getActivitySummary,
        getActivitySummaryRange,
        resetState,
    };
}
