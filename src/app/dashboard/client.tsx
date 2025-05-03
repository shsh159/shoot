'use client';

import { useGetHistoryMonth } from '@api/history.quries';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('@components/chart/Chart'), {
  ssr: false,
});

export default function Client() {
  const { data } = useGetHistoryMonth('2025-05');

  return <Chart />;
}
