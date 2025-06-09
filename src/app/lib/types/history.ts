export type AddType = 'income' | 'expense';

export type RowData = {
  no?: number;
  id?: number;
  description: string;
  amount: number;
  date: string;
  writer: string;
  type: AddType;
  categoryId: number;
  categoryName?: string;
};
