import { useQuery } from '@tanstack/react-query';
import { fetchHistoryList, fetchMonthAmount } from './history.api';

interface ChartProps {
  amountList: {
    date: string;
    prevAmount: number;
    currentAmount: number;
  }[];
}

export const useGetHistoryList = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['FETCH_HISTORY_LIST'],
    queryFn: fetchHistoryList,
  });

  return { isLoading, data };
};

export const useGetHistoryMonth = (targetMonth: string) => {
  const { isLoading, data } = useQuery<ChartProps>({
    queryKey: ['FETCH_HISTORY_MONTH', targetMonth],
    queryFn: () => fetchMonthAmount(targetMonth),
  });

  return { isLoading, data };
};
