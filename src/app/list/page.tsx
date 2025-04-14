'use client';

import { useState } from 'react';
import { Box, Button } from '@mui/material';
import HistoryGrid from '../components/grid/historyGrid';
import DefaultLayout from '../components/layout/defaultLayout';
import styles from './page.module.scss';
import HistoryAddModal from '../components/modal/historyAddModal';
import { useGetHistoryList } from '../api/history.quries';

export default function List() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { data: historyList, isLoading } = useGetHistoryList();

  return (
    <DefaultLayout>
      {!isLoading && (
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
      )}
    </DefaultLayout>
  );
}
