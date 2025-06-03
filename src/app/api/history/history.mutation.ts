import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addHistory, modifyHistory } from './history.api';

export const usePostHistoryAdd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addHistory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['FETCH_HISTORY_LIST'],
      });
    },
    onError: (error: any) => {
      console.log('addHistory error', error.response.data);
    },
  });
};

export const usePutHistoryModify = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: modifyHistory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['FETCH_HISTORY_LIST'],
      });
    },
    onError: (error: any) => {
      console.log('modifyHistory error', error.response.data);
    },
  });
};
