import axios from "axios";

export const fetchHistoryList = async () => {
  const response = await axios.get('http://localhost:4000/list');
  return response.data;
};

export const addHistory = async (historyData: any): Promise<any> => {
    const response = await axios.post('http://localhost:4000/add', historyData);
    return response.data; // 응답이 string 타입이므로, 그대로 반환
  };

export const modifyHistory = async (historyData: any): Promise<any> => {
    const response = await axios.put('http://localhost:4000/update', historyData);
    return response.data; // 응답이 string 타입이므로, 그대로 반환
  };
