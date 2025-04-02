import { TextField, Button, Typography, Box, Modal, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./historyAddModal.module.scss";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "dayjs/locale/ko"; // 한글 로케일 추가
import { SubmitHandler, useController, useForm } from "react-hook-form";
import { useEffect } from "react";

interface RowData {
  no: number;
  description: string;
  amount: number;
  date: Dayjs; // date는 string으로 되어있습니다.
  writer: string;
  type: string;
}

interface AddHistoryModalProps {
  open: boolean;
  handleClose: () => void;
  selectedData?: RowData | null;
}

const today = dayjs();

export default function HistoryAddModal({ open, handleClose, selectedData }: AddHistoryModalProps) {

  const { control, handleSubmit, watch, setValue } = useForm<RowData>();

  const {
    field: type,
  } = useController({
    name: 'type',
    control,
    defaultValue: selectedData?.type || '', // 초기값 처리
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
    defaultValue: selectedData?.date ? dayjs(selectedData.date) : today, // Dayjs 객체로 초기화
  });

  const onSubmit = (data: RowData) => {
    console.log("내역:", data);
  };

  const initForm = () => {
    if (selectedData) {
      setValue('type', selectedData.type);
      setValue('writer', selectedData.writer);
      setValue('amount', selectedData.amount);
      setValue('description', selectedData.description);
      setValue('date', dayjs(selectedData.date));
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
          {selectedData ? (
            <Typography variant="h5" gutterBottom>
              내역 수정
            </Typography>
          ) : (
            <Typography variant="h5" gutterBottom>
              내역 추가
            </Typography>
          )}
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

          {/* TextField for Writer */}
          <TextField
            {...writer} // useController로부터 받은 field 객체를 사용
            label="누구?"
            fullWidth
            margin="normal"
          />

          {/* TextField for Amount */}
          <TextField
            {...amount} // useController로부터 받은 field 객체를 사용
            label="금액"
            type="number"
            fullWidth
            margin="normal"
          />

          {/* TextField for Description */}
          <TextField
            {...description} // useController로부터 받은 field 객체를 사용
            label="설명"
            fullWidth
            margin="normal"
          />

          {/* DatePicker for Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              value={date.value} // useController로부터 받은 value
              label="날짜"
              defaultValue={selectedData?.date ? dayjs(selectedData.date) : today}
              views={['year', 'month', 'day']}
              onChange={(newValue) => {
                // setValue 대신에 직접 date.onChange 호출
                date.onChange(newValue);
              }}
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
