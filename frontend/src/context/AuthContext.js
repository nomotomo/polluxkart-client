import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('polluxkart-user');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUser(parsed.user || parsed);
        setToken(parsed.token || null);
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('polluxkart-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user and token to localStorage
  const saveUserData = useCallback((userData, authToken) => {
    const dataToSave = {
      user: userData,
      token: authToken,
    };
    localStorage.setItem('polluxkart-user', JSON.stringify(dataToSave));
    setUser(userData);
    setToken(authToken);
  }, []);

  const login = async (identifier, password, method = 'email') => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(identifier, password);
      saveUserData(response.user, response.token);
      setIsLoading(false);
      return response.user;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (name, email, phone, password) => {
    setIsLoading(true);
    try {
      const response = await AuthService.register(name, phone, password, email);
      saveUserData(response.user, response.token);
      setIsLoading(false);
      return response.user;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('polluxkart-user');
    // Also clear cart and wishlist data since they're user-specific
    localStorage.removeItem('polluxkart-cart');
    localStorage.removeItem('polluxkart-wishlist');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
