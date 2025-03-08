import React, { createContext, useState, useContext, useEffect } from 'react';
import { initializeDefaultUsers } from '../utils/initializeDefaultUsers';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and provides auth context
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize default users
    initializeDefaultUsers();
    
    // Check if user is logged in when the component mounts
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    // Get users from local storage
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store current user in local storage
      const userData = { name: user.name, email: user.email, role: user.role };
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setCurrentUser(userData);
      return true;
    }
    
    return false;
  };

  // Register function
  const register = (name, email, password) => {
    // Get users from local storage
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false;
    }
    
    // Add new user
    const newUser = { 
      id: Date.now().toString(), 
      name, 
      email, 
      password,
      role: 'user' // Default role
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const userData = { name: newUser.name, email: newUser.email, role: newUser.role };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
    
    return true;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};