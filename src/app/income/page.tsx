"use client";

import { useState } from "react";
import { TextField, Button, Typography, Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./page.module.scss";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "dayjs/locale/ko"; // 한글 로케일 추가

interface AddIncomeModalProps {
  open: boolean;
  handleClose: () => void;
}

const today = dayjs();

export default function AddIncomeModal({ open, handleClose }: AddIncomeModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [writer, setWriter] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("입금 내역:", { amount, description });

    setAmount("");
    setDescription("");
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-income-modal">
      <Box className={styles.modalContainer}>
        <IconButton className={styles.closeButton} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <Typography id="add-income-modal" variant="h5" gutterBottom>
          입금 내역 추가
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="누구?"
            fullWidth
            margin="normal"
            value={writer}
            onChange={(e) => setWriter(e.target.value)}
            required
          />
          <TextField
            label="금액"
            type="number"
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <TextField
            label="설명"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              defaultValue={today}
              views={['year', 'month', 'day']}
            />
          </LocalizationProvider>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            추가하기
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
