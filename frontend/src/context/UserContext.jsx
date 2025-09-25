import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import API from "./api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cropDetails, setCropDetails] = useState(null);

  // Function to handle login
  const login = async (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded JWT:', decoded); // Debug log
      
      const userData = {
        id: decoded.userid || decoded.id || decoded._id,
        name: decoded.username || decoded.name,
        email: decoded.email,
        phone: decoded.phone
      };
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem("token", token);
      
      // Optionally fetch crop details after login
      if (userData.id) {
        await fetchCropDetails(userData.id);
      }
    } catch (error) {
      console.error("Invalid token", error);
      logout();
    }
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCropDetails(null);
    localStorage.removeItem("token");
  };

  // Function to fetch crop details
  const fetchCropDetails = async (farmerId) => {
    try {
      const response = await API.get(`/crop/fetch_crop_details/${farmerId}`);
      setCropDetails(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching crop details:", error);
      setCropDetails(null);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is still valid
        if (decoded.exp * 1000 > Date.now()) {
          const userData = {
            id: decoded.userid || decoded.id || decoded._id,
            name: decoded.username || decoded.name,
            email: decoded.email,
            phone: decoded.phone
          };
          setUser(userData);
          setIsLoggedIn(true);
          
          // Fetch crop details if user ID is available
          if (userData.id) {
            fetchCropDetails(userData.id);
          }
        } else {
          // Token expired
          logout();
        }
      } catch (error) {
        console.error("Invalid token", error);
        logout();
      }
    }

    // Listen for logout events from API interceptor
    const handleAuthLogout = () => {
      logout();
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isLoggedIn, 
      setIsLoggedIn,
      login,
      logout,
      cropDetails,
      setCropDetails,
      fetchCropDetails 
    }}>
      {children}
    </UserContext.Provider>
  );
};
