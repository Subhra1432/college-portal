import React, { useState } from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Typography,
  Link,
  Paper,
  Alert,
  CircularProgress,
  TextField,
} from '@mui/material';
import { LockReset as LockResetIcon } from '@mui/icons-material';

// This would be your actual Redux action for password reset
// For now we'll just create a placeholder function
const resetPassword = (email) => {
  return { type: 'RESET_PASSWORD_REQUEST', payload: { email } };
};

// Custom text field component using Material UI with Formik
const TextFieldWrapper = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);
  
  const configTextField = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: 'outlined',
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }

  return <TextField {...configTextField} />;
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  
  // Get auth state from Redux - in a real app, this would have loading and error states
  const { loading, error } = useSelector((state) => state.auth || { loading: false, error: null });

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(resetPassword(values.email));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <LockResetIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        
        <Typography component="h1" variant="h5" gutterBottom>
          Reset Password
        </Typography>
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {submitted ? (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              If an account exists with this email, you will receive password reset instructions shortly.
            </Alert>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Return to Login
            </Button>
          </Box>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <TextFieldWrapper
                  name="email"
                  type="email"
                  label="Email Address"
                  margin="normal"
                  autoFocus
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {(isSubmitting || loading) ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Reset Password'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Remember your password? Sign in
                  </Link>
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword; 