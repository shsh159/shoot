"use client";

import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("출금 내역:", { amount, description });

    // TODO: 출금 내역을 상태 관리
    setAmount("");
    setDescription("");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          출금 내역 추가
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
    </Container>
  );
}
