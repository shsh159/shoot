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
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAlertStore } from '@stores/useAlertStore';
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
    refetch,
    isLoading: isAnalyzeLoading,
  } = useGetAnalyzeSpending();
  const showAlert = useAlertStore((state) => state.showAlert);

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 769, // 모바일 끝
        md: 1025, // 태블릿 끝
        lg: 1280,
        xl: 1536,
      },
    },
  });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await refetch();

      if (res.isError) {
        const errorMessage =
          res.error?.message || '지출 분석 중 알 수 없는 오류가 발생했습니다.';
        showAlert('error', errorMessage);
        return;
      }

      if (res.data?.analysis) {
        setAnalysisMessage(res.data.analysis);
        setModalOpen(true);
      }
    } catch (error) {
      console.error('분석 에러 발생:', error);
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
        flexDirection={isMobile || isTablet ? 'column' : 'row'}
        flexWrap="wrap"
        gap={2}
        sx={{ marginBottom: '40px' }}
      >
        <Box
          sx={{
            width: isMobile ? '100%' : isTablet ? '70%' : 'calc(80% - 8px)',
          }}
        >
          {monthData?.amountList ? (
            <MonthlyChart
              amountList={monthData.amountList}
              isMobile={isMobile}
            />
          ) : (
            <Skeleton
              variant="rounded"
              animation="wave"
              width="100%"
              height={isMobile ? 280 : 340}
            />
          )}
        </Box>
        <Box sx={{ width: isMobile ? '100%' : 'calc(20% - 8px)' }}>
          {monthData?.totalAmount ? (
            <CardComponent totalAmount={monthData.totalAmount} />
          ) : (
            <Skeleton
              variant="rounded"
              animation="wave"
              width="100%"
              height={isMobile ? 160 : 340}
            />
          )}
        </Box>
      </Box>

      <Box sx={{ height: isMobile ? 280 : 340, mt: 2 }}>
        {!isYearLoading ? (
          <YearlyChart
            amountList={yearData?.amountList ?? []}
            isMobile={isMobile}
          />
        ) : (
          <Skeleton
            variant="rounded"
            animation="wave"
            width="100%"
            height="100%"
          />
        )}
      </Box>
    </>
  );
}
