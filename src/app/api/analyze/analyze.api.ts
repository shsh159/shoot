import axios from 'axios';

const baseUrl = process.env.API_BASE_URL;

export const fetchAnalyzeSpending = async (): Promise<{ analysis: string }> => {
  try {
    const response = await axios.post(`${baseUrl}/analyze/spending`, null, {
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
