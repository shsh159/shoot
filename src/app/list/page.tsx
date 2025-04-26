'use client';

import { useState } from 'react';
import { Box, Button, Skeleton } from '@mui/material';
import HistoryGrid from '../components/grid/HistoryGrid';
import DefaultLayout from '../components/layout/DefaultLayout';
import styles from './page.module.scss';
import HistoryAddModal from '../components/modal/HistoryAddModal';
import { useGetHistoryList } from '../api/history.quries';

export default function List() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { data: historyList, isLoading } = useGetHistoryList();

  return (
    <DefaultLayout>
      {!isLoading ? (
        <>
          <Box className={styles.contentWrapper}>
            <Box className={styles.buttonWrapper}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setModalOpen(true)}
              >
                내역 추가
              </Button>
            </Box>
            <Box className={styles.gridWrapper}>
              <HistoryGrid historyList={historyList} />
            </Box>
          </Box>
          <HistoryAddModal
            open={modalOpen}
            handleClose={() => setModalOpen(false)}
          />
        </>
      ) : (
        <Box className={styles.contentWrapper}>
          <Box className={styles.buttonWrapper}>
            <Skeleton
              variant="rounded"
              width={88}
              height={35}
              animation="wave"
            />
          </Box>

          <Box className={styles.gridWrapper}>
            <Skeleton
              variant="rounded"
              animation="wave"
              width="100%"
              height="100%"
              className={styles.gridWrapper}
            />
          </Box>
        </Box>
      )}
    </DefaultLayout>
  );
}
