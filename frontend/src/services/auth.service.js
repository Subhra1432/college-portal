import api from '../api/axios';

const API_URL = '/auth';

// Register user
const register = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('token', response.data.data.token);
  }
  
  return response.data.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post(`${API_URL}/login`, userData);
  
  if (response.data) {
    const user = response.data.data;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', user.token);
    localStorage.setItem('isAuthenticated', 'true');
    return user;
  }

  throw new Error('Login failed');
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('isAuthenticated');
};

// Get current user
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found');
  }
  
  try {
    const response = await api.get(`${API_URL}/me`);
    return response.data.data;
  } catch (error) {
    // Return the stored user if API call fails (offline support)
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    throw error;
  }
};

// Update user profile
const updateProfile = async (profileData) => {
  const response = await api.put(`${API_URL}/update-profile`, profileData);
  
  // Update user in localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const updatedUser = { ...user, ...response.data.data };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return response.data.data;
};

// Change password
const changePassword = async (passwordData) => {
  const response = await api.put(`${API_URL}/change-password`, passwordData);
  return response.data;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
};

export default AuthService; 