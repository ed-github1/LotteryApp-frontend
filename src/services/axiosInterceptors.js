import axios from 'axios'

// Create axios interceptor to handle token expiration
export const setupAxiosInterceptors = (logout, checkTokenExpiration) => {
  // Request interceptor to add token to headers
  axios.interceptors.request.use(
    (config) => {
      // Check if token is expired before making request
      if (checkTokenExpiration && checkTokenExpiration()) {
        // Token expired, reject the request
        return Promise.reject(new Error('Token expired'))
      }

      const storedUser = localStorage.getItem('loggedLotteryappUser')
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.token) {
            config.headers.Authorization = `Bearer ${userData.token}`
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error)
        }
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor to handle token expiration responses
  axios.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // Check for token expiration status codes
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        const errorMessage = error.response.data?.message || error.response.data?.error || ''
        
        // Check if the error is related to token expiration
        if (
          errorMessage.toLowerCase().includes('expired') ||
          errorMessage.toLowerCase().includes('invalid token') ||
          errorMessage.toLowerCase().includes('unauthorized')
        ) {
          console.log('Token expired from API response, logging out user')
          logout()
        }
      }
      return Promise.reject(error)
    }
  )
}

export default setupAxiosInterceptors
