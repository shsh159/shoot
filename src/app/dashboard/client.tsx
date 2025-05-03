'use client';

import { useGetHistoryMonth } from '@api/history.quries';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('@components/chart/Chart'), {
  ssr: false,
});

export default function Client() {
  const currentMonth = dayjs().format('YYYY-MM');
  const { data } = useGetHistoryMonth(currentMonth);
  return <Chart data={data} />;
}
