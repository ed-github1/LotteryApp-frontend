import { createContext, useContext, useState, useEffect } from 'react'
import { registerUser, logIn } from '../services/authService'



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
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Refresh user data to ensure full object (including email)
      if (parsedUser._id) {
        refreshUser(); // Call refreshUser to update with latest data
      }
    }
    // Sync token from localStorage on mount
    const storedToken = localStorage.getItem('loggedLotteryappToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []); // Note: refreshUser is not in deps to avoid loops

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
      window.localStorage.setItem(
        'loggedLotteryappUser',
        JSON.stringify(res.user)
      )
      // Store token separately if user refresh window 
      if (res.token) {
        window.localStorage.setItem('loggedLotteryappToken', res.token);
        setToken(res.token);
      }
      setAuthErrors([])
    } catch (error) {
      const backendMsg =
        error.response?.data?.error ||
        error.message ||
        'Login failed. Please try again.'
      setAuthErrors([backendMsg])
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setAuthErrors([])
    setMessage('')
    window.localStorage.removeItem('loggedLotteryappUser')
    window.localStorage.removeItem('loggedLotteryappToken')
    setToken(null)
  }

  const refreshUser = async () => {
    if (!user || !token) return;
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  useEffect(() => {
    if (authErrors.length > 0) {
      const timer = setTimeout(() => {
        setAuthErrors([])
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [authErrors])

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
        loading,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
