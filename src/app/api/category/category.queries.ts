import { useQuery } from '@tanstack/react-query';
import { fetchCategoryList } from './category.api';

export const useGetCategoryList = () => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['FETCH_CATEGORY_LIST'],
    queryFn: fetchCategoryList,
    enabled: false,
  });

  return { isLoading, data, refetch };
};
