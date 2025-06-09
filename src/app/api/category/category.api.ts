import axios from 'axios';

const baseUrl = 'http://localhost:4000';

export const fetchCategoryList = async () => {
  const response = await axios.get(`${baseUrl}/category/list`, {
    withCredentials: true,
  });
  return response.data;
};
