"use client";

import { useState } from "react";
import { Box, Button } from "@mui/material";
import HistoryGrid from "../components/historyGrid";
import DefaultLayout from "../components/layout/defaultLayout";
import styles from "./page.module.scss";
import HistoryAddModal from "../components/modal/historyAddModal";

export default function List() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DefaultLayout>
        <Box className={styles.contentWrapper}>
            <Box className={styles.buttonWrapper}>
                <Button type="button" variant="outlined" onClick={() => setModalOpen(true)}>
                    내역 추가
                </Button>
            </Box>
            <Box className={styles.gridWrapper}>
                <HistoryGrid />
            </Box>
        </Box>

      <HistoryAddModal open={modalOpen} handleClose={() => setModalOpen(false)} />
    </DefaultLayout>
  );
}
