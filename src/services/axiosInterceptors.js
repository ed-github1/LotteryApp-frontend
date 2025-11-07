import axios from 'axios'

// Create axios interceptor to handle token and auth headers
export const setupAxiosInterceptors = (logout, checkTokenExpiration) => {
  axios.interceptors.request.use(
    (config) => {
      const storedUser = localStorage.getItem('loggedLotteryappUser');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.token) {
            config.headers.Authorization = `Bearer ${userData.token}`;
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }

      // Diagnostic logging for debugging API call blocking
      console.log('[AXIOS INTERCEPTOR] config.url:', config.url, 'config.method:', config.method);

      // Allow login requests even if token is missing/expired
      const isLoginRoute = config.url && config.url.includes('/login');
      if (isLoginRoute) {
        console.log('[AXIOS INTERCEPTOR] Allowing login route:', config.url);
        return config;
      }

      // If a checkTokenExpiration function was provided, use it to
      // proactively detect expired or missing tokens and log the user out
      try {
        if (typeof checkTokenExpiration === 'function' && checkTokenExpiration()) {
          if (typeof logout === 'function') {
            logout();
          }
          // Reject the request so it doesn't go out with an invalid token
          return Promise.reject(new axios.Cancel('Token expired'));
        }
      } catch (err) {
        // On any error while checking token, log out defensively
        if (typeof logout === 'function') logout();
        return Promise.reject(err);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle token expiration or missing token
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Let the provided logout function handle clearing state/storage
        if (typeof logout === 'function') logout();
      }
      return Promise.reject(error);
    }
  );
}
