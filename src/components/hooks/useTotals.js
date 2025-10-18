import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';  // Add this import

export const useTotals = (type) => {
  const [dailyTotals, setDailyTotals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();  // Use useAuth to get token

  useEffect(() => {
    const fetchTotals = async () => {
      setLoading(true);
      setError(null);

      // Calculate month and year based on type
      const now = new Date();
      let targetMonth = now.getMonth() + 1; // JS months are 0-based
      let targetYear = now.getFullYear();

      if (type === 'last-month') {
        targetMonth -= 1;
        if (targetMonth === 0) {
          targetMonth = 12;
          targetYear -= 1;
        }
      } else if (type !== 'this-month') {
        // For other types (e.g., 'all' or 'custom'), skip or handle differently
        setDailyTotals([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/daily-totals?month=${targetMonth}&year=${targetYear}`, {
          headers: { Authorization: `Bearer ${token}` }  // Token is now available
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        // Format for Recharts: array of { day: number, revenue: number, ... }
        const formattedData = (data.dailyTotals || []).map(item => ({
          day: item._id,
          revenue: item.revenue || 0,
          orders: item.orders || 0,
          pending: item.pending || 0,
          approved: item.approved || 0,
          rejected: item.rejected || 0
        }));
        setDailyTotals(formattedData);
      } catch (err) {
        console.error('Error fetching daily totals:', err);
        setError(err.message);
        setDailyTotals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, [type, token]);  // Add token to dependencies

  return { dailyTotals, loading, error };
};