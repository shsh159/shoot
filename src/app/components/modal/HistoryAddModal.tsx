import {
  TextField,
  Button,
  Typography,
  Box,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import styles from './historyAddModal.module.scss';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko'; // 한글 로케일 추가
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  useDeleteHistory,
  usePostHistoryAdd,
  usePutHistoryModify,
} from '@api/history/history.mutation';
import { useAlertStore } from '@stores/useAlertStore';
import { RowData } from '@lib/types/history';
import { useGetCategoryList } from '@api/category/category.queries';

interface AddHistoryModalProps {
  open: boolean;
  handleClose: () => void;
  selectedData?: RowData | null;
}

const today = dayjs();

const formSchema = z.object({
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: '구분을 선택해주세요.' }),
  }),
  writer: z.string().min(1, { message: '누구인지 입력해 주세요.' }),
  amount: z.coerce.number().min(1, { message: '금액을 입력해 주세요.' }),
  description: z.string().min(1, { message: '설명을 입력해 주세요.' }),
  date: z.string().min(1, { message: '날짜를 선택해 주세요.' }),
  categoryId: z.coerce.number().min(1, { message: '항목을 선택해 주세요.' }),
});

type FormData = z.infer<typeof formSchema>;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
};

export default function HistoryAddModal({
  open,
  handleClose,
  selectedData,
}: AddHistoryModalProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const [selectId, setSeletedId] = useState<number>(selectedData?.id || 0);

  const { field: type } = useController({
    name: 'type',
    control,
    defaultValue: selectedData?.type || 'income',
  });

  const { field: writer } = useController({
    name: 'writer',
    control,
    defaultValue: selectedData?.writer || '',
  });

  const { field: amount } = useController({
    name: 'amount',
    control,
    defaultValue: selectedData?.amount || 0,
  });

  const { field: description } = useController({
    name: 'description',
    control,
    defaultValue: selectedData?.description || '',
  });

  const { field: date } = useController({
    name: 'date',
    control,
    defaultValue: selectedData?.date ? selectedData.date : String(today.toDate),
  });

  const { field: categoryId } = useController({
    name: 'categoryId',
    control,
    defaultValue: selectedData?.categoryId ? selectedData.categoryId : 1,
  });

  const { mutate: addHistory } = usePostHistoryAdd();
  const { mutate: modifyHistory } = usePutHistoryModify();
  const { mutate: deleteHistory } = useDeleteHistory();

  const showAlert = useAlertStore((state) => state.showAlert);

  const { data: categoryList, isLoading, refetch } = useGetCategoryList();

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    const transformedData = {
      id: selectId,
      writer: data.writer,
      type: data.type,
      amount: data.amount,
      description: data.description,
      date: format(data.date, 'yyyy-MM-dd'),
      categoryId: data.categoryId,
    };
    try {
      if (transformedData.id < 1) {
        addHistory(transformedData, {
          onSuccess(data) {
            showAlert('success', data.message);
            handleClose();
          },
          onError(error) {
            showAlert('error', error.response.data.message);
          },
        });
        reset();
      } else {
        modifyHistory(transformedData, {
          onSuccess(data) {
            showAlert('success', data.message);
            handleClose();
          },
          onError(error) {
            showAlert('error', error.response.data.message);
          },
        });
        reset();
      }
    } catch (e) {
      console.error('onSubmit Exception', e);
    }
  };

  // 작성 중 모달 close하면 새로 입력한 데이터 초기화를 위해
  const handleModalClose = () => {
    reset();
    handleClose();
  };

  const handleDelete = () => {
    deleteHistory(selectId, {
      onSuccess(data) {
        showAlert('success', data.message);
        handleClose();
      },
      onError(error) {
        showAlert('error', error.response.data.message);
      },
    });
  };

  const initForm = () => {
    if (open) {
      reset({
        type: selectedData?.type || 'income',
        writer: selectedData?.writer || '',
        amount: selectedData?.amount || 0,
        description: selectedData?.description || '',
        date: selectedData?.date || String(today.toDate()),
        categoryId: selectedData?.categoryId || 1,
      });
      setSeletedId(selectedData?.id || 0);
    }
  };

  useEffect(() => {
    if (!categoryList && open) {
      refetch();
    }
    initForm();
  }, [open, selectedData]);

  return (
    <>
      {!isLoading && (
        <Modal
          open={open}
          onClose={handleModalClose}
          aria-labelledby="add-income-modal"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={styles.modalContainer}>
              <Typography variant="h5" gutterBottom>
                {selectedData ? '내역 수정' : '내역 추가'}
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="type-select-label">구분</InputLabel>
                <Select {...type} labelId="type-select-label" label="구분">
                  <MenuItem value={'income'}>입금</MenuItem>
                  <MenuItem value={'expense'}>출금</MenuItem>
                </Select>
              </FormControl>
              {errors.type && (
                <Typography color="error">{errors.type.message}</Typography>
              )}
              {categoryList && (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="category-select-label">항목</InputLabel>
                  <Select
                    {...categoryId}
                    labelId="category-select-label"
                    label="항목"
                    defaultValue={
                      selectedData?.categoryId || categoryList[0].id
                    }
                    MenuProps={MenuProps}
                  >
                    {categoryList &&
                      categoryList?.map((item: any, index: number) => (
                        <MenuItem key={`category-${index}`} value={item?.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}

              {errors.categoryId && (
                <Typography color="error">
                  {errors.categoryId.message}
                </Typography>
              )}

              <TextField
                {...writer}
                label="누구?"
                fullWidth
                margin="normal"
                error={!!errors.writer}
                helperText={errors.writer?.message}
              />

              <TextField
                {...amount}
                label="금액"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />

              <TextField
                {...description}
                label="설명"
                fullWidth
                margin="normal"
                error={!!errors.description}
                helperText={errors.description?.message}
              />

              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="ko"
              >
                <DatePicker
                  value={dayjs(date.value)}
                  label="날짜"
                  onChange={(newValue) => setValue('date', String(newValue))}
                  views={['year', 'month', 'day']}
                />
              </LocalizationProvider>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                {selectedData ? '수정하기' : '추가하기'}
              </Button>

              {selectedData && (
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleDelete}
                >
                  삭제하기
                </Button>
              )}
            </Box>
          </form>
        </Modal>
      )}
    </>
  );
}
