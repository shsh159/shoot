export type MonthChart = {
  amountList: {
    date: string;
    prevAmount: number;
    currentAmount: number;
  }[];
  totalAmount: TotalAmount;
};

export type YearChart = {
  amountList: {
    month: string;
    amount: number;
  }[];
};

export type TotalAmount = {
  prevTotal: number;
  currentTotal: number;
};
