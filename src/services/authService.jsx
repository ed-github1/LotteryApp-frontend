
import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth` : `/api/auth`;

export const registerUser = async (data) => {
  const res = await axios.post(`${baseUrl}/register`, data);
  return res.data;
};

export const verifyEmail = async (token) => {
  const res = await axios.get(`${baseUrl}/verify-email`, { params: { token } });
  return res.data;
};

export const logIn = async (data) => {
  const res = await axios.post(`${baseUrl}/login`, data);
  return res.data;
};
