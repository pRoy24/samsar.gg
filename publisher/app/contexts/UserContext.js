// UserContext.js
import React, { useState, useContext, createContext } from 'react';
import axios from 'axios';


const PROCESSOR_SERVER = process.env.REACT_APP_PROCESSOR_API || 'http://localhost:3002';

// Step 2: Define the User Context
const UserContext = createContext({
  user: null,
  setUser: (profile) => { },
  getUser: () => { },
  setUser: (profile) => { },
  resetUser: () => { },
  getUserFromProvider: () => ({ user: null }),
  userFetching: false


});




// Step 3: Create the Context Provider
export const UserProvider = ({ children }) => {

  const [user, setUserState] = useState(null);
  const [userFetching, setUserFetching] = useState(false);


  // Function to update the user state
  const getUserFromProvider = (profile) => {



  };

  const setUser = (profile) => {
    setUserState(profile);
  }

  // Function to retrieve the current user state
  const getUser = () => {
    return user;
  };

  const resetUser = () => {
    setUserState(null);
    localStorage.removeItem("fid");
  }


  return (
    <UserContext.Provider value={{ user, getUser, getUserFromProvider, resetUser, setUser, userFetching }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
