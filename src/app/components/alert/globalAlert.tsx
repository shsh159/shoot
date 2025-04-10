// components/GlobalMuiAlert.tsx
'use client'; // Next.js App Router 사용 시 필요

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import { useAlertStore } from '../../stores/useAlertStore';

export default function GlobalAlert() {
  const { type, message, show } = useAlertStore();

  return (
    <Stack
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 20,
        right: 20,
        maxWidth: 400,
        zIndex: 9999,
      }}
      spacing={2}
    >
      <Collapse in={show}>
        <Alert severity={type}>{message}</Alert>
      </Collapse>
    </Stack>
  );
}
