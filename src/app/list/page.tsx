"use client";

import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import HistoryGrid from "../components/grid/historyGrid";
import DefaultLayout from "../components/layout/defaultLayout";
import styles from "./page.module.scss";
import HistoryAddModal from "../components/modal/historyAddModal";
import axios from "axios";

interface Typee {
  id: number;
  member: Array<{ id: number; name: string }>;
}

export default function List() {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState<Typee | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/list');
        
        // 응답 데이터를 그대로 상태에 저장
        setData(response.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DefaultLayout>
      {data && (
        <>
          <Box className={styles.contentWrapper}>
              <Box className={styles.buttonWrapper}>
                <Button type="button" variant="outlined" onClick={() => setModalOpen(true)}>
                  내역 추가{data.id}
                </Button>
              </Box>
              <Box className={styles.gridWrapper}>
                <HistoryGrid />
              </Box>
            </Box>
          <HistoryAddModal open={modalOpen} handleClose={() => setModalOpen(false)} />
        </>
      )}
    </DefaultLayout>
  );
}
