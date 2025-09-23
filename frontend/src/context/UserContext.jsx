import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle login
  const login = (token) => {
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
    } catch (error) {
      console.error("Invalid token", error);
      logout();
    }
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is still valid
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            id: decoded.userid || decoded.id || decoded._id,
            name: decoded.username || decoded.name,
            email: decoded.email,
            phone: decoded.phone
          });
          setIsLoggedIn(true);
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
      logout 
    }}>
      {children}
    </UserContext.Provider>
  );
};
