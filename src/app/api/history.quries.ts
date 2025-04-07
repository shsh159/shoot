import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// 데이터 조회 함수
const fetchHistory = async () => {
  const response = await axios.get('http://localhost:4000/list');
  return response.data;
};

// 커스텀 훅
export const useGetHistoryQuery = () => {
    const { isLoading, data, error } = useQuery({
        queryKey: ['FETCH_HISTORY'], // 쿼리 키
        queryFn: fetchHistory,       // 쿼리 함수
      });

  return { isLoading, data, error };
};
