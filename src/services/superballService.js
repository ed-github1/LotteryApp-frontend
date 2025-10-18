import axios from 'axios'
import { toast } from 'react-toastify'

const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/superball` : '/api/superball';
const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

// Error handler utility
const handleApiError = (error, customMessage = 'An error occurred') => {
  console.error('SuperBall API Error:', error)
  
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error || customMessage
    toast.error(message)
    throw new Error(message)
  } else if (error.request) {
    // Request made but no response
    const message = 'Unable to connect to server. Please try again later.'
    toast.error(message)
    throw new Error(message)
  } else {
    // Something else happened
    toast.error(customMessage)
    throw error
  }
}

// Check if SuperBall is currently active and get jackpot amount
export const checkSuperballStatus = async () => {
  try {
    const res = await axios.get(`${baseUrl}/jackpot`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to load SuperBall jackpot information')
  }
}

// Submit SuperBall entry with user's selected numbers
export const sendSuperBallOrder = async (tickets, token) => {
  try {
    const res = await axios.post(
      `${baseUrl}/enter`,
      { tickets },
      getAuthConfig(token)
    )
    toast.success('SuperBall entry submitted successfully!')
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to submit SuperBall entry')
  }
}

// Get my SuperBall entries (user-specific)
export const getMySuperBallEntries = async (token) => {
  try {
    const res = await axios.get(`${baseUrl}/entries`, getAuthConfig(token))
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to load your SuperBall entries')
  }
}

// Get all SuperBall orders (admin/testing)
export const getSuperBallOrders = async (token) => {
  try {
    const res = await axios.get(`${baseUrl}/orders`, getAuthConfig(token))
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to load SuperBall orders')
  }
}

// Get all SuperBall draw results with winners
export const getSuperballWinners = async () => {
  try {
    const res = await axios.get(`${baseUrl}/winners`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to load SuperBall winners')
  }
}

// Get winners for a specific draw date
export const getSuperballWinnersByDate = async (drawDate) => {
  try {
    const res = await axios.get(`${baseUrl}/winners/${encodeURIComponent(drawDate)}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to load winners for the selected date')
  }
}

// Check if current user has any wins
export const checkMyWins = async (token) => {
  try {
    const res = await axios.get(`${baseUrl}/my-wins`, getAuthConfig(token))
    return res.data
  } catch (error) {
    // Don't show toast for this - it's called periodically in background
    console.error('Failed to check wins:', error)
    return { hasWins: false, wins: [] }
  }
}

// Admin: Post SuperBall winner number (triggers jackpot award)
export const postSuperballWinner = async (drawDate, winnerNumber, token) => {
  try {
    const res = await axios.post(
      `${baseUrl}/draw-winner`,
      { drawDate, winnerNumber },
      getAuthConfig(token)
    )
    toast.success('SuperBall winner number posted successfully!')
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to post SuperBall winner number')
  }
}

