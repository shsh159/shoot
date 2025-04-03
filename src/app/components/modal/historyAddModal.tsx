import { TextField, Button, Typography, Box, Modal, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./historyAddModal.module.scss";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "dayjs/locale/ko"; // 한글 로케일 추가
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // zod import
import { useEffect } from "react";

type addType = "income" | "expense";

// 수정된 RowData 인터페이스
interface RowData {
  no?: number;
  description: string;
  amount: number;
  date: string;
  writer: string;
  type: addType;
}

interface AddHistoryModalProps {
  open: boolean;
  handleClose: () => void;
  selectedData?: RowData | null;
}

const today = dayjs();

// Zod schema for form validation
const formSchema = z.object({
  type: z.enum(['income', 'expense'], { errorMap: () => ({ message: "구분을 선택해주세요." }) }),
  writer: z.string().min(1, { message: "누구인지 입력해 주세요." }),
  amount: z.coerce.number().min(1, { message: "금액을 입력해 주세요." }),
  description: z.string().min(1, { message: "설명을 입력해 주세요." }),
  date: z.string().min(1, { message: "날짜를 선택해 주세요." }),
});

export default function HistoryAddModal({ open, handleClose, selectedData }: AddHistoryModalProps) {
  const { control, handleSubmit, setValue, formState: { errors }, watch } = useForm<RowData>({
    resolver: zodResolver(formSchema),
  });

  const {
    field: type,
  } = useController({
    name: 'type',
    control,
    defaultValue: selectedData?.type || 'income',
  });

  const {
    field: writer,
  } = useController({
    name: 'writer',
    control,
    defaultValue: selectedData?.writer || '', // 초기값 처리
  });

  const {
    field: amount,
  } = useController({
    name: 'amount',
    control,
    defaultValue: selectedData?.amount || 0,
  });

  const {
    field: description,
  } = useController({
    name: 'description',
    control,
    defaultValue: selectedData?.description || '',
  });

  const {
    field: date,
  } = useController({
    name: 'date',
    control,
    defaultValue: selectedData?.date ? selectedData.date : String(today.toDate), // Dayjs 객체로 초기화
  });

  const onSubmit: SubmitHandler<RowData> = (data: RowData) => {
    console.log("내역:", data);
  };

  const initForm = () => {
    if (selectedData) {
      setValue('type', selectedData.type);
      setValue('writer', selectedData.writer);
      setValue('amount', selectedData.amount);
      setValue('description', selectedData.description);
      setValue('date', selectedData.date);
    }
  }

  useEffect(() => {
    initForm();
  }, [selectedData]);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-income-modal">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className={styles.modalContainer}>
          <IconButton className={styles.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" gutterBottom>
            {selectedData ? '내역 수정' : '내역 추가'}
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="type-select-label">구분</InputLabel>
            <Select
              {...type}
              labelId="type-select-label"
              label="구분"
            >
              <MenuItem value={'income'}>입금</MenuItem>
              <MenuItem value={'expense'}>출금</MenuItem>
            </Select>
          </FormControl>
          {errors.type && <Typography color="error">{errors.type.message}</Typography>}

          {/* TextField for Writer */}
          <TextField
            {...writer}
            label="누구?"
            fullWidth
            margin="normal"
            error={!!errors.writer}
            helperText={errors.writer?.message}
          />

          {/* TextField for Amount */}
          <TextField
            {...amount}
            label="금액"
            type="number"
            fullWidth
            margin="normal"
            error={!!errors.amount}
            helperText={errors.amount?.message}
          />

          {/* TextField for Description */}
          <TextField
            {...description}
            label="설명"
            fullWidth
            margin="normal"
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          {/* DatePicker for Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              value={dayjs(date.value)}
              label="날짜"
              onChange={(newValue) => setValue('date', String(newValue))} // react-hook-form의 setValue 사용
              views={['year', 'month', 'day']}
            />
          </LocalizationProvider>

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {selectedData ? '수정하기' : '추가하기'}
          </Button>
        </Box>
      </form>
    </Modal>
  );
}
