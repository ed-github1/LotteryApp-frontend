import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser, logIn } from '../services/authService'
import { setupAxiosInterceptors } from '../services/axiosInterceptors'



// Create the context
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be within an AuthProvider')
  }
  return context


}

// Provider component
export const AuthProvider = ({ children }) => {
  const [authErrors, setAuthErrors] = useState([])
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => window.localStorage.getItem('loggedLotteryappToken') || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedLotteryappUser');
    const storedToken = localStorage.getItem('loggedLotteryappToken');
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      // No token: clear user and redirect to login
      setUser(null);
      setToken(null);
      localStorage.removeItem('loggedLotteryappUser');
      localStorage.removeItem('loggedLotteryappToken');
      if (window.location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    }
    // Pass logout to interceptor so it can clear user state on 401
    setupAxiosInterceptors(logout, checkTokenExpiration);
  }, []);

  const createUser = async (data) => {
    try {
      const res = await registerUser(data)
      setMessage(res.message)
      setAuthErrors([]) // clear errors on success
    } catch (err) {
      // Try to get error message from backend response
      const backendMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        'Registration failed'
      setAuthErrors([backendMsg])
      setMessage('')
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      setAuthErrors([])
      const res = await logIn(credentials)
      setUser(res.user)
      window.localStorage.setItem('loggedLotteryappUser', JSON.stringify(res.user))
      if (res.token) {
        window.localStorage.setItem('loggedLotteryappToken', res.token)
        setToken(res.token)
      }
    } catch (error) {
      setAuthErrors([error.message || 'Login failed. Please try again.'])
    } finally {
      setLoading(false)
    }
  }

  const navigate = useNavigate();
  const logout = () => {
    setUser(null);
    setAuthErrors([]);
    setMessage('');
    window.localStorage.removeItem('loggedLotteryappUser');
    window.localStorage.removeItem('loggedLotteryappToken');
    // Clear tutorial guide flags
    window.localStorage.removeItem('hasSeenLotteryTutorial');
    window.localStorage.removeItem('hasSeenTicketSummaryGuide');
    window.localStorage.removeItem('hasSeenPaymentGuide');
    setToken(null);
    // Only navigate if not already on login page
    if (window.location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  };

  // Check token expiration by decoding JWT 'exp' claim
  const checkTokenExpiration = () => {
    try {
      const t = window.localStorage.getItem('loggedLotteryappToken')
      if (!t) return true
      const parts = t.split('.')
      if (parts.length < 2) return true
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      if (!payload.exp) return true
      const now = Math.floor(Date.now() / 1000)
      return payload.exp <= now
    } catch (err) {
      console.error('Error checking token expiration', err)
      return true
    }
  }

  return (
    <AuthContext.Provider
      value={{
        createUser,
        user,
        login,
        logout,
        authErrors,
        message,
        token,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
