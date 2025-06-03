import { useQuery } from '@tanstack/react-query';
import {
  fetchHistoryList,
  fetchMonthAmount,
  fetchYearAmount,
} from './history.api';
import { MonthChart, YearChart } from '@lib/types/chart';

export const useGetHistoryList = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['FETCH_HISTORY_LIST'],
    queryFn: fetchHistoryList,
  });

  return { isLoading, data };
};

export const useGetHistoryMonth = (targetMonth: string) => {
  const { isLoading, data } = useQuery<MonthChart>({
    queryKey: ['FETCH_HISTORY_MONTH', targetMonth],
    queryFn: () => fetchMonthAmount(targetMonth),
  });

  return { isLoading, data };
};

export const useGetHistoryYear = () => {
  const { isLoading, data } = useQuery<YearChart>({
    queryKey: ['FETCH_HISTORY_YEAR'],
    queryFn: () => fetchYearAmount(),
  });

  return { isLoading, data };
};
