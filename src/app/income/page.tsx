"use client";

import { useState } from "react";
import { TextField, Button, Typography, Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./page.module.scss";

interface AddIncomeModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function AddIncomeModal({ open, handleClose }: AddIncomeModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            추가하기
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
