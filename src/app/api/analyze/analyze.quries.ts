import { useQuery } from '@tanstack/react-query';
import { fetchAnalyzeSpending } from './analyze.api';

interface AnalyzeResponse {
  analysis: string;
}

export const useGetAnalyzeSpending = () => {
  return useQuery<AnalyzeResponse>({
    queryKey: ['FETCH_ANALYZE_SPENDING'],
    queryFn: fetchAnalyzeSpending,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};
