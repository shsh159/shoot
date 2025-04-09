import { useQuery } from "@tanstack/react-query";
import { fetchHistoryList } from "./history.api";

export const useGetHistoryList = () => {
    const { isLoading, data } = useQuery({
        queryKey: ['FETCH_HISTORY_LIST'], // 쿼리 키
        queryFn: fetchHistoryList,       // 쿼리 함수
      });

  return { isLoading, data };
};
