import axios from 'axios';

const API_URL = '/api/auth';

// Mock user database
const MOCK_USERS = [
  {
    _id: 'admin123',
    email: 'admin@college.edu',
    password: 'admin123',
    name: 'Admin User',
    registrationNumber: 'ADM2023001',
    role: 'admin',
    department: 'Administration',
    token: 'mock-jwt-token-admin'
  },
  {
    _id: 'teacher123',
    email: 'teacher@college.edu',
    password: 'teacher123',
    name: 'John Smith',
    registrationNumber: 'TCH2023001',
    role: 'teacher',
    department: 'Computer Science',
    token: 'mock-jwt-token-teacher'
  },
  {
    _id: 'student123',
    email: 'student@college.edu',
    password: 'student123',
    name: 'Jane Doe',
    registrationNumber: 'CS2023001',
    role: 'student',
    department: 'Computer Science',
    token: 'mock-jwt-token-student'
  }
];

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('token', response.data.data.token);
  }
  
  return response.data.data;
};

// Login user
const login = async (userData) => {
  console.log('AuthService login attempt with:', userData);
  
  try {
    // Try to connect to the backend
    console.log('Attempting to connect to backend at', `${API_URL}/login`);
    const response = await axios.post(`${API_URL}/login`, userData);
    
    console.log('Backend login response:', response);
    
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('isAuthenticated', 'true');
    }
    
    return response.data.data;
  } catch (error) {
    console.log('Backend connection failed, using mock login instead');
    console.log('Error details:', error.message);
    
    // Fall back to mock login
    console.log('Checking mock user database for:', userData.identifier);
    
    // Check if the user exists in our mock database
    const foundUser = MOCK_USERS.find(user => 
      (user.email === userData.identifier || user.registrationNumber === userData.identifier) && 
      user.password === userData.password
    );
    
    if (foundUser) {
      console.log('Mock user found:', foundUser.email);
      
      // Create a copy without the password field for security
      const { password, ...userWithoutPassword } = foundUser;
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', userWithoutPassword.token);
      localStorage.setItem('isAuthenticated', 'true');
      
      console.log('Mock login successful, returning user:', userWithoutPassword);
      return userWithoutPassword;
    } else {
      console.log('Mock login failed - invalid credentials');
      // If credentials don't match, reject with an error
      throw new Error('Invalid email/registration number or password');
    }
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Get current user
const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    
    const response = await axios.get(`${API_URL}/me`, config);
    return response.data.data;
  } catch (error) {
    // For testing: return the stored user if API call fails
    console.log('Getting stored user from localStorage');
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log('Retrieved user from localStorage:', parsedUser);
      return parsedUser;
    }
    throw error;
  }
};

// Update user profile
const updateProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.put(`${API_URL}/update-profile`, profileData, config);
  
  // Update user in localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const updatedUser = { ...user, ...response.data.data };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return response.data.data;
};

// Change password
const changePassword = async (passwordData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.put(`${API_URL}/change-password`, passwordData, config);
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