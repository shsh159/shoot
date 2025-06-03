import axios from 'axios';

const baseUrl = 'http://localhost:4000';

export const fetchHistoryList = async () => {
  const response = await axios.get(`${baseUrl}/list`, {
    withCredentials: true,
  });
  return response.data;
};

export const addHistory = async (historyData: any): Promise<any> => {
  const response = await axios.post(`${baseUrl}/add`, historyData, {
    withCredentials: true,
  });
  return response.data;
};

export const modifyHistory = async (historyData: any): Promise<any> => {
  const response = await axios.put(`${baseUrl}/update`, historyData, {
    withCredentials: true,
  });
  return response.data;
};

export const fetchMonthAmount = async (targetMonth: string) => {
  const response = await axios.get(`${baseUrl}/month`, {
    params: { month: targetMonth },
    withCredentials: true,
  });
  return response.data;
};

export const fetchYearAmount = async () => {
  const response = await axios.get(`${baseUrl}/year`, {
    withCredentials: true,
  });
  return response.data;
};
