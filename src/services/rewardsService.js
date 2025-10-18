import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/winners` : '/api/winners';

const getAuthConfig = (token) => {
  console.log('🔐 Creating auth config with token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export async function getMyWins(token) {
  console.log(`📡 Calling ${baseUrl}/my-wins with token:`, token ? 'Present' : 'Missing');
  const response = await axios.get(`${baseUrl}/my-wins`, getAuthConfig(token));
  console.log('✅ API Response:', response.data);
  return response.data;
}
