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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { login, reset } from '../../features/auth/authSlice';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isAuthenticated, navigate, dispatch]);

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required('Email or Registration Number is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
    </Box>
  );
};

export default Login; 