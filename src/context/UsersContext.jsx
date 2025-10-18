import { createContext, useContext, useState } from 'react'

// Create the context
const UserContext = createContext()

// Provider component
export const UserProvider = ({ children }) => {

 


  return (
    <UserContext.Provider value={{}}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook for easy access
export const useUser = () => useContext(UserContext)
