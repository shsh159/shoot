'use client';

import { Backdrop, CircularProgress } from '@mui/material';
import { useLoadingStore } from '@stores/useLoadingStore';

export default function GlobalSpinner() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <Backdrop
      open={isLoading}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
