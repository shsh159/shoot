'use client';

import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoginForm } from '@lib/types/login';
import { useLoginUser } from '@api/login/login.mutation';
import { useRouter } from 'next/navigation';
import { useAlertStore } from '@stores/useAlertStore';
import { useLoadingStore } from '@stores/useLoadingStore';

const formSchema = z.object({
  userId: z.string().min(1, { message: '아이디를 입력해 주세요.' }),
  userPassword: z.string().min(1, { message: '비밀번호를 입력해 주세요.' }),
});

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(formSchema),
  });

  const { field: userId } = useController({
    name: 'userId',
    control,
    defaultValue: '',
  });

  const { field: userPassword } = useController({
    name: 'userPassword',
    control,
    defaultValue: '',
  });

  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const showAlert = useAlertStore((state) => state.showAlert);

  const { mutate } = useLoginUser();

  const onSubmit = (data: LoginForm) => {
    setLoading(true);
    mutate(data, {
      onSuccess: () => {
        router.push('/list');
        setTimeout(() => setLoading(false), 500);
      },
      onError: (error) => {
        setTimeout(() => setLoading(false), 500);
        showAlert('error', error.message);
      },
    });
  };

  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid #ccc',
            padding: 4,
            borderRadius: 2,
            boxShadow: 2,
            backgroundColor: '#fff',
          }}
        >
          <Typography component="h1" variant="h5" mb={2}>
            로그인
          </Typography>

          <Box sx={{ width: '100%' }}>
            <TextField
              {...userId}
              label="아이디"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.userId}
              helperText={errors.userId?.message}
            />
            <TextField
              {...userPassword}
              label="비밀번호"
              variant="outlined"
              margin="normal"
              fullWidth
              type="password"
              error={!!errors.userPassword}
              helperText={errors.userPassword?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              로그인
            </Button>
          </Box>
        </Box>
      </form>
    </Container>
  );
}
