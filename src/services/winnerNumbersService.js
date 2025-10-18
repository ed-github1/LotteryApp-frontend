import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/winner-numbers` : '/api/winner-numbers';

const getAuthConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
})

// Get latest winner numbers for all countries
export const getLatestWinnerNumbersService = async (token) => {
  const res = await axios.get(`${baseUrl}/week`, getAuthConfig(token))
  return res.data
}

// Get only the current/latest winner numbers (no token required for public view)
export const getCurrentWinnerNumbers = async () => {
  try {
    const res = await axios.get(`${baseUrl}/week`);
    const allWinners = res.data;
    // Handle backend returning a single object instead of an array
    if (allWinners && allWinners.winnerNumbers) {
      return [allWinners];
    }
    return [];
  } catch (error) {
    console.error('Error fetching current winner numbers:', error);
    throw error;
  }
};

// Get winner numbers for a specific country (history)
export const getCountryWinnerNumbersService = async (countryCode, token) => {
  const res = await axios.get(
    `${baseUrl}?countryCode=${countryCode}`,
    getAuthConfig(token)
  )
  return res.data // Array of { countryCode, drawDate, winnerNumber }
}

// Get WinnerNumber document by drawDate (GET)
export const getWinnerNumberByDrawDateService = async (drawDate, token) => {
  const res = await axios.get(
    `${baseUrl}?drawDate=${encodeURIComponent(drawDate)}`,
    getAuthConfig(token)
  )
  return res.data
}

// Create a WinnerNumber document for a draw date (POST)
// payload: { drawDate, winnerNumbers: { [countryCode]: winnerNumber } }
export const createWinnerNumberService = async (payload, token) => {
  const res = await axios.post(baseUrl, payload, getAuthConfig(token))
  return res.data
}

// Patch (add/update) a winner number for a country in a WinnerNumber document (PATCH)
// id: WinnerNumber document _id, payload: { countryCode, winnerNumber }
export const patchWinnerNumberService = async (id, payload, token) => {
  const res = await axios.patch(
    `${baseUrl}/${id}`,
    payload,
    getAuthConfig(token)
  )
  return res.data
}
