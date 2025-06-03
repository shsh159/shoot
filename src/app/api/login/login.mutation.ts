import { useMutation } from '@tanstack/react-query';
import { loginUser } from './login.api'; // 경로에 따라 수정

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('로그인 성공:', data);
    },
    onError: (error: any) => {
      console.error('로그인 실패:', error?.response?.data || error.message);
    },
  });
};
