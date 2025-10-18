import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAdminPendingOrders, getAdminPaidOrders, getAdminRejectedOrders, sendOrder, getMonthlyRevenue, getMyOrders } from '../services/ordersService';
// Import the daily revenue function
import { getDailyRevenueTotals } from '../services/ordersService';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [paidTotalPages, setPaidTotalPages] = useState(1);
  const [orders, setOrders] = useState([])
  const [rejectedTotalPages, setRejectedTotalPages] = useState(1);
  const [pendingTotalCount, setPendingTotalCount] = useState(0);
  const [paidTotalCount, setPaidTotalCount] = useState(0);
  const [rejectedTotalCount, setRejectedTotalCount] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [myPaidOrders, setMyPaidOrders] = useState([]);
  const [dailyTotals, setDailyTotals] = useState([]);
  const [totalsLoading, setTotalsLoading] = useState(false);
  const [totalsError, setTotalsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const socket = useSocket();

  const fetchMyPaidOrders = useCallback(async (page = 1, limit = 20, startDate, endDate) => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getMyOrders(token, page, limit, startDate, endDate);
  const paidOrdersArr = Array.isArray(data.orders) ? data.orders : [];
  setMyPaidOrders(paidOrdersArr);
  console.log('[OrdersContext] myPaidOrders set:', paidOrdersArr);
    } catch (error) {
      setMyPaidOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchMyPaidOrders();
    }
  }, [token, fetchMyPaidOrders]);


  // Helper functions
  const sanitizePage = (page) => {
    const p = Number(page);
    return Number.isInteger(p) && p > 0 ? p : 1;
  };
  const sanitizeLimit = (limit) => {
    const l = Number(limit);
    return Number.isInteger(l) && l > 0 && l < 100 ? l : 20;
  };

  const getValidDates = (startDate, endDate) => {
    // Accepts JS Date or ISO string
    const parsedStart = startDate instanceof Date ? startDate.toISOString() : startDate;
    const parsedEnd = endDate instanceof Date ? endDate.toISOString() : endDate;
    return { parsedStart, parsedEnd };
  };

  // Fetchers
  const fetchPendingOrders = useCallback(async (type, page = 1, limit = 20, startDate, endDate) => {
    setLoading(true);
    try {
      const { parsedStart, parsedEnd } = getValidDates(startDate, endDate);
      const numericLimit = sanitizeLimit(limit);
      const numericPage = sanitizePage(page);

      const data = await getAdminPendingOrders(parsedStart, parsedEnd, numericPage, numericLimit, token);
      setPendingOrders(Array.isArray(data.orders) ? data.orders : []);
      setPendingTotalPages(data.totalPages || 1);
      setPendingTotalCount(data.totalCount || 0);
    } catch (error) {
      setPendingOrders([]);
      setPendingTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchPaidOrders = useCallback(async (type, page = 1, limit = 20, startDate, endDate) => {
    setLoading(true);
    try {
      const { parsedStart, parsedEnd } = getValidDates(startDate, endDate);
      const numericLimit = sanitizeLimit(limit);
      const numericPage = sanitizePage(page);

      const data = await getAdminPaidOrders(parsedStart, parsedEnd, numericPage, numericLimit, token);
      setPaidOrders(Array.isArray(data.orders) ? data.orders : []);
      setPaidTotalPages(data.totalPages || 1);
      setPaidTotalCount(data.totalCount || 0);
    } catch (error) {
      setPaidOrders([]);
      setPaidTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchRejectedOrders = useCallback(async (type, page = 1, limit = 20, startDate, endDate) => {
    setLoading(true);
    try {
      const { parsedStart, parsedEnd } = getValidDates(startDate, endDate);
      const numericLimit = sanitizeLimit(limit);
      const numericPage = sanitizePage(page);

      const data = await getAdminRejectedOrders(parsedStart, parsedEnd, numericPage, numericLimit, token);
      setRejectedOrders(Array.isArray(data.orders) ? data.orders : []);
      setRejectedTotalPages(data.totalPages || 1);
      setRejectedTotalCount(data.totalCount || 0);
    } catch (error) {
      setRejectedOrders([]);
      setRejectedTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Add fetchDailyTotals function
  const fetchDailyTotals = useCallback(async (startDate, endDate) => {
    if (!startDate || !endDate || !token) return;

    console.log('fetchDailyTotals called with:', { startDate, endDate, hasToken: !!token });

    setTotalsLoading(true);
    setTotalsError(null);

    try {
      // OPTION 1: Use mock data for testing
      const useMockData = true; // Set to false when you want to use real API

      if (useMockData) {
        console.log('Using MOCK data for daily totals');

        // Create mock data for 30 days
        const mockData = {
          dailyTotals: Array.from({ length: 30 }, (_, i) => ({
            day: i + 1,
            revenue: Math.random() * 200 + 50, // Random revenue between 50-250
            orders: Math.floor(Math.random() * 15) + 1 // Random orders 1-15
          }))
        };

        console.log('Generated mock daily totals:', mockData.dailyTotals.slice(0, 3), `...and ${mockData.dailyTotals.length - 3} more`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setDailyTotals(mockData.dailyTotals);
      } else {
        // OPTION 2: Use real API call
        console.log('Using REAL API for daily totals');

        // Extract month and year from startDate for your backend
        const date = new Date(startDate);
        const month = date.getMonth() + 1; // getMonth() is 0-indexed
        const year = date.getFullYear();

        console.log('Calling API with month/year:', { month, year });

        const data = await getDailyRevenueTotals(month, year, token);

        // Transform backend data to match chart expectations
        const transformedData = data.dailyTotals.map(item => ({
          day: item._id.day,
          revenue: item.totalAmount,
          orders: item.orderCount
        }));

        console.log('Transformed daily totals:', transformedData);
        setDailyTotals(transformedData);
      }

    } catch (error) {
      console.error('Error fetching daily totals:', error);
      setTotalsError(error.message);
      setDailyTotals([]);
    } finally {
      setTotalsLoading(false);
    }
  }, [token]);

  // Create order for users
  const createOrder = useCallback(async (payload) => {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }
      const newOrder = await sendOrder(payload, token);

      // Add to local orders state
      setOrders(prevOrders => [newOrder, ...prevOrders]);

      const parseDate = (dateStr) => {
        if (dateStr === 'this-month') {
          return new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        } else if (dateStr === '1') {
          // Assuming '1' means end of the current month
          const now = new Date();
          return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
        } else {
          return dateStr; // Assume it's already a valid date string
        }
      };


      // Emit socket event for real-time updates
      if (socket) {
        socket.emit('orderCreated', newOrder);
      }

      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }, [token, socket]);

  const submitOrder = useCallback(async (payload, navigate) => {
    console.log('[OrdersContext] Submitting order with payload:', payload);
    await createOrder(payload);
    navigate('/dashboard/pending');
  }, [createOrder]);

  const fetchMonthlyRevenue = useCallback(async (startDate, endDate) => {
    try {
      const revenue = await getMonthlyRevenue(startDate, endDate, token);
      console.log('monthlyRevenue in context:', revenue);
      setMonthlyRevenue(revenue || 0);
    } catch {
      setMonthlyRevenue(0);
    }
  }, [token]);


  return (
    <OrdersContext.Provider value={{
      orders,
      submitOrder,
      fetchMyPaidOrders,
      myPaidOrders,
      pendingOrders,
      paidOrders,
      rejectedOrders,
      pendingTotalPages,
      paidTotalPages,
      rejectedTotalPages,
      pendingTotalCount,
      paidTotalCount,
      rejectedTotalCount,
      fetchPendingOrders,
      fetchPaidOrders,
      fetchRejectedOrders,
      fetchMonthlyRevenue,
      monthlyRevenue,
      dailyTotals,
      totalsLoading,
      totalsError,
      fetchDailyTotals,
      loading
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
export default OrdersContext;