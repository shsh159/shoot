import { useQuery } from '@tanstack/react-query';
import { fetchCategoryList } from './category.api';

export const useGetCategoryList = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['FETCH_CATEGORY_LIST'],
    queryFn: fetchCategoryList,
  });

  return { isLoading, data };
};
