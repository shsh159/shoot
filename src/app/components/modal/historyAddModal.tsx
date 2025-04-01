"use client";

import { useState } from "react";
import { TextField, Button, Typography, Box, Modal, IconButton, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./historyAddModal.module.scss";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "dayjs/locale/ko"; // 한글 로케일 추가

interface RowData {
  no: number;
  description: string;
  amount: number;
  date: string;
  writer: string;
  type: string;
}

interface AddIncomeModalProps {
  open: boolean;
  handleClose: () => void;
  selectedData?: RowData | null;
}

const today = dayjs();

export default function HistoryAddModal({ open, handleClose, selectedData }: AddIncomeModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [writer, setWriter] = useState("");
  const [addType, setAddType] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("내역:", { amount, description });

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
        {selectedData ? (
          <Typography variant="h5" gutterBottom>
            내역 수정
          </Typography>
        ) : (
          <Typography variant="h5" gutterBottom>
            내역 추가
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <InputLabel id="type-select-label">구분</InputLabel>
          <Select
            labelId="type-select-label"
            value={selectedData?.type || addType}
            label="구분"
            onChange={(e) => setAddType(e.target.value)}
          >
            <MenuItem value={'income'}>입금</MenuItem>
            <MenuItem value={'expense'}>출금</MenuItem>
          </Select>
        </FormControl>
          <TextField
            label="누구?"
            fullWidth
            margin="normal"
            value={selectedData?.writer || writer}
            onChange={(e) => setWriter(e.target.value)}
            required
          />
          <TextField
            label="금액"
            type="number"
            fullWidth
            margin="normal"
            value={selectedData?.amount || amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <TextField
            label="설명"
            fullWidth
            margin="normal"
            value={selectedData?.description || description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              defaultValue={selectedData?.date ? dayjs(selectedData.date) : today}
              views={['year', 'month', 'day']}
            />
          </LocalizationProvider>
          {selectedData ? (
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              수정하기
            </Button>
          ) : (
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              추가하기
            </Button>
          )}
        </form>
      </Box>
    </Modal>
  );
}
