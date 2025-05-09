'use client';

import { useGetHistoryMonth } from '@api/history.quries';
import CardComponent from '@components/card/Card';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('@components/chart/Chart'), {
  ssr: false,
});

export default function Client() {
  const currentMonth = dayjs().format('YYYY-MM');
  const { data } = useGetHistoryMonth(currentMonth);

  return (
    <Box display="flex" gap={2} sx={{ height: '400px' }}>
      <Chart amountList={data?.amountList ?? []} />
      {data?.totalAmount && <CardComponent totalAmount={data.totalAmount} />}
    </Box>
  );
}
