"use client";

import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import HistoryGrid from "../components/grid/historyGrid";
import DefaultLayout from "../components/layout/defaultLayout";
import styles from "./page.module.scss";
import HistoryAddModal from "../components/modal/historyAddModal";
import { useGetHistoryList } from "../api/history.quries";

interface IRow {
  no?: number;
  description: string;
  amount: number;
  date: string;
  writer: string;
  type: "income" | "expense";
}

export default function List() {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<IRow[] | null>(null);

  const { data : historyList } = useGetHistoryList();

  useEffect(() => {
    setData(historyList)
  }, [historyList]);

  return (
    <DefaultLayout>
      {data && (
        <>
          <Box className={styles.contentWrapper}>
              <Box className={styles.buttonWrapper}>
                <Button type="button" variant="outlined" onClick={() => setModalOpen(true)}>
                  내역 추가
                </Button>
              </Box>
              <Box className={styles.gridWrapper}>
                <HistoryGrid historyList={data} />
              </Box>
            </Box>
          <HistoryAddModal open={modalOpen} handleClose={() => setModalOpen(false)} />
        </>
      )}
    </DefaultLayout>
  );
}
