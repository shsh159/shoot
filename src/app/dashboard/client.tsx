'use client';

import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('@components/chart/Chart'), {
  ssr: false,
});

export default function Client() {
  return <Chart />;
}
