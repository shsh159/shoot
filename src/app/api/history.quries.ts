import { useQuery } from '@tanstack/react-query';
import {
  fetchHistoryList,
  fetchMonthAmount,
  fetchYearAmount,
} from './history.api';

interface ChartProps {
  amountList: {
    date: string;
    prevAmount: number;
    currentAmount: number;
  }[];
  totalAmount: {
    prevTotal: number;
    currentTotal: number;
  };
}

interface YearChartProps {
  amountList: {
    month: string;
    amount: number;
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

export const useGetHistoryYear = () => {
  const { isLoading, data } = useQuery<YearChartProps>({
    queryKey: ['FETCH_HISTORY_YEAR'],
    queryFn: () => fetchYearAmount(),
  });

  return { isLoading, data };
};
