import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/winners` : '/api/winners';


// Helper: Get today's draw date string for Mexico City at 7pm local time
export function getMexicoCityDrawDateString() {
  const dt = new Date();
  dt.setHours(19, 0, 0, 0); // 7pm local time
  const pad = n => n.toString().padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:00:00`;
}

// Fetch current draw winners, prize pool, carryover, etc.
export async function getCurrentWinners() {
  const res = await axios.get(`${baseUrl}/current`);
  return res.data;
}

// Fetch all draw history with winners, prize pool, carryover, etc.
// Accept page and pageSize for pagination
export async function getWinnersHistory(page = 1, pageSize = 1) {
  const res = await axios.get(`${baseUrl}/history?page=${page}&pageSize=${pageSize}`);
  return res.data;
}

// Fetch real-time prize pool and carryover for a specific draw date (ISO string)
export async function getPrizePool(drawDate) {
  const res = await axios.get(`${baseUrl}/prize-pool/${encodeURIComponent(drawDate)}`);
  return res.data;
}
