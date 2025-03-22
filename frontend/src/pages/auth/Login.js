import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { login, reset } from '../../features/auth/authSlice';
import AuthService from '../../services/auth.service';

// Mock user data for testing
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
    token: 'admin-token-123',
    department: 'Administration',
    profilePicture: '',
  },
  {
    id: '2',
    name: 'Teacher User',
    email: 'teacher@college.edu',
    password: 'teacher123',
    role: 'teacher',
    token: 'teacher-token-123',
    department: 'Computer Science',
    profilePicture: '',
  },
  {
    id: '3',
    name: 'Student User',
    email: 'student@college.edu',
    password: 'student123',
    role: 'student',
    token: 'student-token-123',
    department: 'Computer Science',
    registrationNumber: 'CS2023001',
    semester: '3rd',
    program: 'B.Tech',
    section: 'A',
    profilePicture: '',
  },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    console.log('Auth state:', { user, loading, error, isAuthenticated });
    setDebugInfo(JSON.stringify({ user, loading, error, isAuthenticated }, null, 2));
    
    if (isAuthenticated) {
      console.log('User authenticated, navigating to dashboard');
      navigate('/dashboard');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isAuthenticated, navigate, dispatch, error, loading]);

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required('Email or Registration Number is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      console.log('Login attempt with:', values);
      try {
        // Try the direct service method first to debug
        const directResult = await AuthService.login(values);
        console.log('Direct login result:', directResult);
        setDebugInfo(prev => prev + '\n\nDirect login result:\n' + JSON.stringify(directResult, null, 2));
        
        // Always force navigation after successful login
        console.log('Login successful, forcing navigation to dashboard');
        
        // Give Redux time to update, but force navigation after a short delay anyway
        setTimeout(() => {
          console.log('Navigating to dashboard after login');
          
          // Manually set isAuthenticated in localStorage if not already set
          if (!localStorage.getItem('isAuthenticated')) {
            localStorage.setItem('isAuthenticated', 'true');
          }
          
          navigate('/dashboard');
        }, 300);
      } catch (directError) {
        console.error('Direct login error:', directError);
        setDebugInfo(prev => prev + '\n\nDirect login error:\n' + JSON.stringify(directError.message, null, 2));
      }
      
      // Then try through Redux
      dispatch(login(values));
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const testMockCredentials = () => {
    console.log('Testing mock credentials');
    formik.setValues({
      identifier: 'student@college.edu',
      password: 'student123',
    });
    
    // Check if student role is properly set in mock data
    console.log('Student Mock User:', MOCK_USERS.find(user => 
      user.email === 'student@college.edu' && user.password === 'student123'
    ));
  };
  
  // Debug function to check localStorage content
  const checkLocalStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('User in localStorage:', parsedUser);
        console.log('User role:', parsedUser.role);
      } else {
        console.log('No user in localStorage');
      }
      
      console.log('Token in localStorage:', storedToken);
      console.log('isAuthenticated in localStorage:', storedIsAuthenticated);
      
      setDebugInfo(prev => prev + '\n\nLocalStorage Content:\n' + 
        `user: ${storedUser}\n` +
        `token: ${storedToken}\n` +
        `isAuthenticated: ${storedIsAuthenticated}`
      );
    } catch (error) {
      console.error('Error checking localStorage:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <FormControl
          fullWidth
          error={Boolean(formik.touched.identifier && formik.errors.identifier)}
          sx={{ mb: 3 }}
        >
          <InputLabel htmlFor="identifier">Email or Registration Number</InputLabel>
          <OutlinedInput
            id="identifier"
            type="text"
            value={formik.values.identifier}
            name="identifier"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            label="Email or Registration Number"
          />
          {formik.touched.identifier && formik.errors.identifier && (
            <FormHelperText error id="error-identifier">
              {formik.errors.identifier}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          error={Boolean(formik.touched.password && formik.errors.password)}
          sx={{ mb: 3 }}
        >
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            name="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {formik.touched.password && formik.errors.password && (
            <FormHelperText error id="error-password">
              {formik.errors.password}
            </FormHelperText>
          )}
        </FormControl>

        {error && (
          <Box sx={{ mb: 3 }}>
            <FormHelperText error>{error}</FormHelperText>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            disableElevation
            disabled={loading}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="primary"
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </Box>
      </form>

      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <Link
          component={RouterLink}
          to="/forgot-password"
          variant="body2"
          color="primary"
        >
          Forgot Password?
        </Link>
        <Link
          component={RouterLink}
          to="/register"
          variant="body2"
          color="primary"
        >
          Create an account
        </Link>
      </Stack>
      
      {/* Debug Section */}
      <Divider sx={{ my: 3 }} />
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Debug Tools
        </Typography>
        <Button 
          variant="outlined" 
          color="secondary" 
          size="small" 
          onClick={testMockCredentials}
          sx={{ mr: 1, mb: 1 }}
        >
          Fill Student Credentials
        </Button>
        <Button 
          variant="outlined" 
          color="info" 
          size="small" 
          onClick={() => console.log('Current state:', { auth: { user, loading, error, isAuthenticated }, formik: formik.values })}
          sx={{ mb: 1 }}
        >
          Log State
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          size="small" 
          onClick={() => navigate('/dashboard')}
          sx={{ ml: 1, mb: 1 }}
        >
          Force Dashboard
        </Button>
        <Button 
          variant="outlined" 
          color="info" 
          size="small" 
          onClick={checkLocalStorage}
          sx={{ mr: 1, mb: 1 }}
        >
          Check Local Storage
        </Button>
        {debugInfo && (
          <Box 
            sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              maxHeight: '200px',
              overflow: 'auto',
              '& pre': {
                margin: 0,
                fontSize: '0.75rem'
              }
            }}
          >
            <pre>{debugInfo}</pre>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Login;