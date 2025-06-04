'use client';

import { useLoadingStore } from '@stores/useLoadingStore';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function RouteChangeHandler() {
  const pathname = usePathname();
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // 최소 표시 시간
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
