'use client';

import { useGetHistoryMonth, useGetHistoryYear } from '@api/history.quries';
import CardComponent from '@components/card/Card';
import { Box, Skeleton } from '@mui/material';
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
  const { data: monthData, isLoading: isMonthLoading } =
    useGetHistoryMonth(currentMonth);
  const { data: yearData, isLoading: isYearLoading } = useGetHistoryYear();

  return (
    <>
      <Box
        display="flex"
        gap={2}
        sx={{ height: '380px', marginBottom: '20px' }}
      >
        <Box sx={{ width: '70%' }}>
          {monthData?.amountList ? (
            <MonthlyChart amountList={monthData.amountList} />
          ) : (
            <Skeleton
              variant="rounded"
              animation="wave"
              width="100%"
              height="100%"
            />
          )}
        </Box>
        <Box sx={{ width: '20%' }}>
          {monthData?.totalAmount ? (
            <CardComponent totalAmount={monthData.totalAmount} />
          ) : (
            <Skeleton
              variant="rounded"
              animation="wave"
              width="100%"
              height="100%"
            />
          )}
        </Box>
      </Box>

      {!isYearLoading ? (
        <Box sx={{ height: '380px' }}>
          <YearlyChart amountList={yearData?.amountList ?? []} />
        </Box>
      ) : (
        <Box sx={{ height: '380px' }}>
          <Skeleton
            variant="rounded"
            animation="wave"
            width="100%"
            height="100%"
          />
        </Box>
      )}
    </>
  );
}
