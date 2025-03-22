import axios from 'axios';

const API_URL = '/api/auth';

// Enhanced mock users with additional data
const MOCK_USERS = [
  {
    _id: 'admin123',
    name: 'Admin User',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
    department: 'Administration',
    phoneNumber: '9876543210',
    token: 'mock-admin-token-12345'
  },
  {
    _id: 'teacher123',
    name: 'Teacher User',
    email: 'teacher@college.edu',
    password: 'teacher123',
    role: 'teacher',
    department: 'Computer Science',
    subjects: ['Web Development', 'Database Systems'],
    phoneNumber: '9876543211',
    token: 'mock-teacher-token-12345'
  },
  {
    _id: 'student123',
    name: 'Student User',
    email: 'student@college.edu',
    password: 'student123',
    role: 'student',
    registrationNumber: 'CS2023001',
    department: 'Computer Science',
    year: 3,
    semester: 5,
    phoneNumber: '9876543212',
    token: 'mock-student-token-12345'
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
  console.log('Login attempt with:', userData);

  try {
    // Try to connect to the backend first
    console.log('Attempting to connect to backend...');
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    
    // If login is successful
    if (response.data) {
      console.log('Backend login successful:', response.data);
      
      // Store user in localStorage
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
      localStorage.setItem('isAuthenticated', 'true');
      
      console.log('Role assigned from backend:', user.role);
      return user;
    }
  } catch (error) {
    console.log('Backend connection failed, using mock data:', error.message);
    
    // Mock login with predefined user data
    const { email, password } = userData;
    
    // Find user with matching email and password
    console.log('Searching for mock user with email:', email);
    const foundUser = MOCK_USERS.find(
      user => user.email === email && user.password === password
    );
    
    if (foundUser) {
      console.log('Mock user found! Role:', foundUser.role);
      
      // Create a copy of the user object without the password
      const { password, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', userWithoutPassword.token);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Double check what's stored in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log('Stored user from localStorage:', storedUser);
      console.log('User role in localStorage:', storedUser.role);
      
      return userWithoutPassword;
    } else {
      console.log('Invalid mock credentials');
      throw new Error('Invalid email or password');
    }
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('isAuthenticated');
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