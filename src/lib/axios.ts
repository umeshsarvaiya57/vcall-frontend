import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Configure standard Axios client instance.
 * Enables withCredentials for secure HTTP-only cookies in admin sections.
 */
export const apiInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data;
    const formattedError = {
      message: errorData?.message || 'Something went wrong',
      code: errorData?.code || 'UNEXPECTED_ERROR',
      status: error.response?.status,
    };
    return Promise.reject(formattedError);
  }
);
