"use client";

import { useState } from "react";
import { Box, Button } from "@mui/material";
import HistoryGrid from "../components/historyGrid";
import DefaultLayout from "../components/layout/defaultLayout";
import AddIncomeModal from "../income/page";
import AddExpenseModal from "../expense/page";
import styles from "./page.module.scss";

export default function List() {
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  return (
    <DefaultLayout>
        <Box className={styles.contentWrapper}>
            <Box className={styles.buttonWrapper}>
                <Button type="button" variant="outlined" onClick={() => setIncomeOpen(true)}>
                    입금
                </Button>
                <Button type="button" variant="outlined" onClick={() => setExpenseOpen(true)}>
                    출금
                </Button>
            </Box>
            <Box className={styles.gridWrapper}>
                <HistoryGrid />
            </Box>
        </Box>

      {/* 입금 모달 */}
      <AddIncomeModal open={incomeOpen} handleClose={() => setIncomeOpen(false)} />
      
      {/* 출금 모달 */}
      <AddExpenseModal open={expenseOpen} handleClose={() => setExpenseOpen(false)} />
    </DefaultLayout>
  );
}
