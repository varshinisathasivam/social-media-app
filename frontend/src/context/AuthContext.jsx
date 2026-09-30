import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pulse_token'));
  const [loading, setLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState([]);

  useEffect(() => {
    // Load demo users list
    authAPI.getDemoUsers()
      .then(res => setDemoUsers(res.data))
      .catch(err => console.error('Failed to load demo users', err));

    // Check existing auth
    if (token) {
      authAPI.getMe()
        .then(res => {
          setUser(res.data.user);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (loginIdentifier, password) => {
    const res = await authAPI.login({ loginIdentifier, password });
    localStorage.setItem('pulse_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const loginAsDemo = async (username) => {
    return login(username, 'password123');
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    localStorage.setItem('pulse_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('pulse_token');
    setToken(null);
    setUser(null);
  };

  const updateUserState = (updatedFields) => {
    setUser(prev => prev ? { ...prev, ...updatedFields } : prev);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      demoUsers,
      login,
      loginAsDemo,
      register,
      logout,
      updateUserState,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
