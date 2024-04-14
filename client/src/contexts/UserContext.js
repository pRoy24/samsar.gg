// UserContext.js
import React, { useState, useContext, createContext } from 'react';
import axios from 'axios';
const PROCESSOR_SERVER = process.env.REACT_APP_PROCESSOR_API || 'http://localhost:3002';

// Step 2: Define the User Context
const UserContext = createContext({
  user: null,
  setUser: (profile) => { },
  getUser: () => { },
  setUserApi: (profile) => { },
  resetUser: () => { },
  getUserAPI: () => ({ user: null })
  

});

// Step 3: Create the Context Provider
export const UserProvider = ({ children }) => {

  const [user, setUserState] = useState(null);


  // Function to update the user state
  const setUserApi = (profile) => {

   axios.post(`${PROCESSOR_SERVER}/users/set_user`, profile).then((res) => {
    const userProfile = res.data;
    console.log(userProfile);
    
    localStorage.setItem('fid', userProfile.fid);
    setUserState(userProfile);

    }).catch((err) => {

    });

  };

  const setUser= (profile) => {
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

  const getUserAPI = () => {
    let fid = localStorage.getItem("fid");
    console.log("GETTING PROFILE");
    console.log(fid);

    if (!fid || fid === "undefined" || fid.length === 0) {
      return null;
    }

    axios.get(`${PROCESSOR_SERVER}/users/profile?fid=${fid}`).then((res) => {
    const userProfile = res.data;
    setUserState(userProfile);
    localStorage.setItem('fid', userProfile.fid);
    return userProfile;

    }).catch((err) => {

    });
  }

  return (
    <UserContext.Provider value={{ user, setUserApi, getUser, getUserAPI, resetUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
