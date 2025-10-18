import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/drawSchedules` : '/api/drawSchedules';
// Get draw schedules (no token required)
export const getNextDrawService = async () => {
  try {
    const res = await axios.get(`${baseUrl}/next-draws`)
    return res.data
  } catch (error) {
    console.log(error.message)
  }
}



export const getDrawHitsByDate = async (dateString) => {
  try {
    const res = await axios.get(
      `${baseUrl}/hits/${encodeURIComponent(dateString)}`
    )
    return res.data
  } catch (error) {
    console.log(error.message)
    throw error
  }
}
