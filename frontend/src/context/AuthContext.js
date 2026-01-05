import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('polluxkart-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('polluxkart-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('polluxkart-user');
    }
  }, [user]);

  const login = async (email, password) => {
    setIsLoading(true);
    // Mock login - simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = {
      id: '1',
      name: email.split('@')[0],
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
    };
    setUser(mockUser);
    setIsLoading(false);
    return mockUser;
  };

  const signup = async (name, email, password) => {
    setIsLoading(true);
    // Mock signup - simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = {
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
    };
    setUser(mockUser);
    setIsLoading(false);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
