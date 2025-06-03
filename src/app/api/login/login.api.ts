import axios from 'axios';

const baseUrl = 'http://localhost:4000';

export const loginUser = async (loginData: {
  userId: string;
  userPassword: string;
}) => {
  const response = await axios.post(`${baseUrl}/auth/login`, loginData, {
    withCredentials: true,
  });
  return response.data;
};
