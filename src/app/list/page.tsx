"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import HistoryGrid from "../components/historyGrid";
import DefaultLayout from "../components/layout/defaultLayout";
import AddIncomeModal from "../income/page";
import AddExpenseModal from "../expense/page";

export default function List() {
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  return (
    <DefaultLayout>
      <Button type="button" onClick={() => setIncomeOpen(true)}>
        입금
      </Button>
      <Button type="button" onClick={() => setExpenseOpen(true)}>
        출금
      </Button>
        <HistoryGrid />

      {/* 입금 모달 */}
      <AddIncomeModal open={incomeOpen} handleClose={() => setIncomeOpen(false)} />
      
      {/* 출금 모달 */}
      <AddExpenseModal open={expenseOpen} handleClose={() => setExpenseOpen(false)} />
    </DefaultLayout>
  );
}
