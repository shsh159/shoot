'use client';

import { useGetAnalyzeSpending } from '@api/analyze/analyze.quries';
import {
  useGetHistoryMonth,
  useGetHistoryYear,
} from '@api/history/history.quries';
import CardComponent from '@components/card/Card';
import MonthlyChart from '@components/chart/MonthlyChart';
import YearlyChart from '@components/chart/YearlyChart';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
} from '@mui/material';
import { useLoadingStore } from '@stores/useLoadingStore';
import dayjs from 'dayjs';
import { useState } from 'react';

export default function Client() {
  const currentMonth = dayjs().format('YYYY-MM');
  const [analysisMessage, setAnalysisMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const { data: monthData, isLoading: isMonthLoading } =
    useGetHistoryMonth(currentMonth);
  const { data: yearData, isLoading: isYearLoading } = useGetHistoryYear();
  const {
    data: analyzeData,
    isError,
    refetch,
    isLoading: isAnalyzeLoading,
  } = useGetAnalyzeSpending();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await refetch();
      if (res.data?.analysis) {
        setAnalysisMessage(res.data.analysis);
        setModalOpen(true);
      }
    } catch (err) {
      // 에러 처리 로직
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="contained"
        color="success"
        onClick={handleClick}
        sx={{ mb: 2 }}
      >
        지출 분석
      </Button>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>지출 분석 결과</DialogTitle>
        <DialogContent>
          <Box whiteSpace="pre-line">{analysisMessage}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
      <Box
        display="flex"
        gap={2}
        sx={{ height: '340px', marginBottom: '20px' }}
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
        <Box sx={{ height: '340px' }}>
          <YearlyChart amountList={yearData?.amountList ?? []} />
        </Box>
      ) : (
        <Box sx={{ height: '340px' }}>
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
