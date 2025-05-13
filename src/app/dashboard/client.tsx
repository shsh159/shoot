'use client';

import { useGetHistoryMonth, useGetHistoryYear } from '@api/history.quries';
import CardComponent from '@components/card/Card';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';

const MonthlyChart = dynamic(() => import('@components/chart/MonthlyChart'), {
  ssr: false,
});
const YearlyChart = dynamic(() => import('@components/chart/YearlyChart'), {
  ssr: false,
});

export default function Client() {
  const currentMonth = dayjs().format('YYYY-MM');
  const { data: monthData } = useGetHistoryMonth(currentMonth);
  const { data: yearData } = useGetHistoryYear();

  return (
    <>
      <Box
        display="flex"
        gap={2}
        sx={{ height: '380px', marginBottom: '20px' }}
      >
        {monthData && <MonthlyChart amountList={monthData?.amountList} />}
        {monthData?.totalAmount && (
          <CardComponent totalAmount={monthData.totalAmount} />
        )}
      </Box>
      <Box sx={{ height: '380px' }}>
        {yearData && <YearlyChart amountList={yearData?.amountList} />}
      </Box>
    </>
  );
}
