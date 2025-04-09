import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addHistory } from './history.api';

export const usePostHistoryAdd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addHistory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['FETCH_HISTORY_LIST'],
      });
      return data.message;
    },
    onError: (error: any) => {
      console.error('mutate add err', error);
    },
  });
};
