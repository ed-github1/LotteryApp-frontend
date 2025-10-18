import axios from 'axios'


const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/lottery` : '/api/lottery';



const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

// create order (regular draw)
export const sendOrder = async (order, token) => {
  const res = await axios.post(baseUrl, order, getAuthConfig(token));
  return res.data;
};


//patch order pending for admin 
export const updateOrderStatus = async (orderId, status, token) => {
  if (!token || typeof token !== 'string' || token.length < 10) {
    throw new Error('No valid token provided');
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  // Map frontend status to backend status
  let backendStatus = status;
  if (status === 'accepted') backendStatus = 'paid';
  if (status === 'rejected') backendStatus = 'rejected';
  const res = await axios.patch(`${baseUrl}/${orderId}/validate`, { status: backendStatus }, config);
  return res.data;
};


// Get pending orders (admin)
export const getAdminPendingOrders = async (startDate, endDate, page, limit, token) => {
  const config = {
    ...getAuthConfig(token),
    params: { startDate, endDate, page, limit }
  }
  const res = await axios.get(`${baseUrl}/pending`, config);
  return res.data
};

export const getAdminPaidOrders = async (startDate, endDate, page, limit, token) => {
  const config = {
    ...getAuthConfig(token),
    params: { startDate, endDate, page, limit }
  };
  const res = await axios.get(`${baseUrl}/paid`, config);
  return res.data;
};

export const getAdminRejectedOrders = async (startDate, endDate, page, limit, token) => {
  const config = {
    ...getAuthConfig(token),
    params: { startDate, endDate, page, limit }
  };
  const res = await axios.get(`${baseUrl}/rejected`, config);
  return res.data;
};


export const getMyOrders = async (token, page = 1, limit = 10, startDate, endDate) => {
  let params = { page, limit };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const config = getAuthConfig(token);
  const res = await axios.get(`${baseUrl}/my`, { ...config, params });
  console.log('ORDERS FOR USER (RECEIPT)', res.data)
  return res.data;
};



export const getMonthlyRevenue = async (startDate, endDate, token) => {
  const config = {
    ...getAuthConfig(token),
    params: { startDate, endDate }
  };
  const res = await axios.get(`${baseUrl}/revenue`, config);
  console.log('Response for monthly-revenue', res.data);
  return res.data.revenue
};



export const getDailyRevenueTotals = async (startDate, endDate, token) => {
  try {
    console.log('Fetching daily revenue totals:', { startDate, endDate });

    const config = {
      ...getAuthConfig(token),
      params: { startDate, endDate }
    };

    const res = await axios.get(`${baseUrl}/daily-revenue`, config);
    console.log('Daily revenue response:', res.data);

    return res.data;
  } catch (error) {
    console.error('Error fetching daily revenue totals:', error);
    throw error;
  }
};




