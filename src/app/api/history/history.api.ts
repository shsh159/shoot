import axios from 'axios';

const baseUrl = 'http://localhost:4000';

export const fetchHistoryList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/history/list`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || 'Unknown server error';
      console.error('서버 에러 메시지:', errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Unexpected error occurred');
    }
  }
};

export const addHistory = async (historyData: any): Promise<any> => {
  try {
    const response = await axios.post(`${baseUrl}/history/add`, historyData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || 'Unknown server error';
      console.error('서버 에러 메시지:', errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Unexpected error occurred');
    }
  }
};

export const modifyHistory = async (historyData: any): Promise<any> => {
  try {
    const response = await axios.put(`${baseUrl}/history/update`, historyData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || 'Unknown server error';
      console.error('서버 에러 메시지:', errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Unexpected error occurred');
    }
  }
};

export const deleteHistory = async (historyId: number): Promise<any> => {
  try {
    const response = await axios.delete(`${baseUrl}/history/delete`, {
      params: { historyId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || 'Unknown server error';
      console.error('서버 에러 메시지:', errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Unexpected error occurred');
    }
  }
};

export const fetchMonthAmount = async (targetMonth: string) => {
  try {
    const response = await axios.get(`${baseUrl}/history/dashboard/month`, {
      params: { month: targetMonth },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || 'Unknown server error';
      console.error('서버 에러 메시지:', errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Unexpected error occurred');
    }
  }
};

export const fetchYearAmount = async () => {
  try {
    const response = await axios.get(`${baseUrl}/history/dashboard/year`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || 'Unknown server error';
      console.error('서버 에러 메시지:', errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Unexpected error occurred');
    }
  }
};
