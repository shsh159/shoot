import { create } from 'zustand';

export type AlertType = 'success' | 'info' | 'warning' | 'error';

interface AlertState {
  type: AlertType;
  message: string;
  show: boolean;
  showAlert: (type: AlertType, message: string) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  type: 'info',
  message: '',
  show: false,
  showAlert: (type, message) => {
    set({ type, message, show: true });

    setTimeout(() => {
      set({ show: false });
    }, 3000); // 자동 사라짐
  },
  hideAlert: () => set({ show: false }),
}));