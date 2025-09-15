import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Profile fetch error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', credentials);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // const register = async (userData) => {
  //   try {
  //     setLoading(true);
  //     const response = await api.post('/auth/register', userData);
  //     const { token, user: newUser } = response.data;
      
  //     localStorage.setItem('token', token);
  //     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //     setUser(newUser);
      
  //     toast.success('Registration successful!');
  //     return { success: true };
  //   } catch (error) {
  //     console.error('Registration error:', error);
  //     const message = error.response?.data?.error || 'Registration failed';
  //     toast.error(message);
  //     return { success: false, error: message };
  //   } finally {
  //     setLoading(false);
  //   }
  // };
// In your useAuth.js file, replace the existing register function with this:

// In your useAuth.js file, replace the existing register function with this:

const register = async (userData) => {
  try {
    setLoading(true);
    console.log('Sending to API:', userData); // Debug log
    
    const response = await api.post('/auth/register', userData);
    console.log('API Response:', response.data); // Debug log
    
    const { token, user: newUser } = response.data;
    
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(newUser);
    
    toast.success('Registration successful!');
    return { success: true };
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      data: error.config?.data
    });
    
    // Log the full error response
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
    }
    if (error.response?.data?.details) {
      console.error('Error details:', error.response.data.details);
    }
    
    const message = error.response?.data?.error || 'Registration failed';
    toast.error(message);
    return { success: false, error: message };
  } finally {
    setLoading(false);
  }
};
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    refreshProfile: fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};