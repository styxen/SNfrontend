import axios, { AxiosRequestConfig, isAxiosError } from 'axios';
import toast from 'react-hot-toast';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const axiosRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await instance.request<T>(config);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data.msg);
    }
    console.log(error);
    throw error;
  }
};

export default instance;
