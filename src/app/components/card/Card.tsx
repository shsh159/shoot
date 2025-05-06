import { CardContent, Typography } from '@mui/material';

interface totalAmountProps {
  totalAmount: {
    prevTotal: number;
    currentTotal: number;
  };
}

export default function Card({ totalAmount }: totalAmountProps) {
  return (
    <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', mb: 1.5 }}>
        이번 달 사용 내역
      </Typography>
      <Typography variant="h5" component="div">
        {totalAmount?.currentTotal} 원
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
        지난 달 대비 증가 금액
      </Typography>
      <Typography variant="h5" component="div">
        {`${totalAmount?.currentTotal - totalAmount?.prevTotal} 원`}
      </Typography>
      <Typography variant="h5" component="div">
        {`${Math.round(
          ((totalAmount?.currentTotal - totalAmount?.prevTotal) /
            totalAmount?.prevTotal) *
            100,
        )} %`}
      </Typography>
    </CardContent>
  );
}
