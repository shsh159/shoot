import axios from 'axios';

const baseUrl = 'http://localhost:4000';

export const fetchAnalyzeSpending = async (): Promise<{ analysis: string }> => {
  const response = await axios.post(`${baseUrl}/analyze/spending`, null, {
    withCredentials: true,
  });
  return response.data;
};
