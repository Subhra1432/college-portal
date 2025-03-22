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
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { register, reset } from '../../features/auth/authSlice';

const departments = [
  'Computer Science',
  'Electronics',
  'Electrical',
  'Mechanical',
  'Civil',
  'Information Technology',
  'Business Administration',
  'Commerce',
  'Economics',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
      name: '',
      email: '',
      registrationNumber: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      department: '',
      // Student specific fields
      rollNumber: '',
      batch: '',
      semester: '',
      // Teacher specific fields
      employeeId: '',
      designation: 'Assistant Professor',
      qualification: '',
      experience: '',
      specialization: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Must be a valid email')
        .required('Email is required'),
      registrationNumber: Yup.string().required('Registration Number is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
      role: Yup.string().required('Role is required'),
      department: Yup.string().required('Department is required'),
      // Conditionally required based on role
      rollNumber: Yup.string().when('role', {
        is: 'student',
        then: Yup.string().required('Roll Number is required'),
      }),
      batch: Yup.string().when('role', {
        is: 'student',
        then: Yup.string().required('Batch is required'),
      }),
      semester: Yup.number().when('role', {
        is: 'student',
        then: Yup.number()
          .min(1, 'Semester must be at least 1')
          .max(10, 'Semester cannot be more than 10')
          .required('Semester is required'),
      }),
      employeeId: Yup.string().when('role', {
        is: 'teacher',
        then: Yup.string().required('Employee ID is required'),
      }),
      designation: Yup.string().when('role', {
        is: 'teacher',
        then: Yup.string().required('Designation is required'),
      }),
      qualification: Yup.string().when('role', {
        is: 'teacher',
        then: Yup.string().required('Qualification is required'),
      }),
      experience: Yup.number().when('role', {
        is: 'teacher',
        then: Yup.number()
          .min(0, 'Experience cannot be negative')
          .required('Experience is required'),
      }),
      specialization: Yup.string().when('role', {
        is: 'teacher',
        then: Yup.string().required('Specialization is required'),
      }),
    }),
    onSubmit: (values) => {
      const userData = { ...values };
      delete userData.confirmPassword;
      dispatch(register(userData));
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Register
      </Typography>
      
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          {/* Common Fields */}
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.name && formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.email && formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            id="registrationNumber"
            name="registrationNumber"
            label="Registration Number"
            value={formik.values.registrationNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(
              formik.touched.registrationNumber && formik.errors.registrationNumber
            )}
            helperText={
              formik.touched.registrationNumber && formik.errors.registrationNumber
            }
          />

          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Role"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              id="department"
              name="department"
              value={formik.values.department}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Department"
              error={Boolean(
                formik.touched.department && formik.errors.department
              )}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.department && formik.errors.department && (
              <FormHelperText error>{formik.errors.department}</FormHelperText>
            )}
          </FormControl>

          {/* Role-based fields */}
          {formik.values.role === 'student' && (
            <>
              <TextField
                fullWidth
                id="rollNumber"
                name="rollNumber"
                label="Roll Number"
                value={formik.values.rollNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(
                  formik.touched.rollNumber && formik.errors.rollNumber
                )}
                helperText={formik.touched.rollNumber && formik.errors.rollNumber}
              />

              <TextField
                fullWidth
                id="batch"
                name="batch"
                label="Batch (e.g., 2020-2024)"
                value={formik.values.batch}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.batch && formik.errors.batch)}
                helperText={formik.touched.batch && formik.errors.batch}
              />

              <TextField
                fullWidth
                id="semester"
                name="semester"
                label="Current Semester"
                type="number"
                InputProps={{ inputProps: { min: 1, max: 10 } }}
                value={formik.values.semester}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(
                  formik.touched.semester && formik.errors.semester
                )}
                helperText={formik.touched.semester && formik.errors.semester}
              />
            </>
          )}

          {formik.values.role === 'teacher' && (
            <>
              <TextField
                fullWidth
                id="employeeId"
                name="employeeId"
                label="Employee ID"
                value={formik.values.employeeId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(
                  formik.touched.employeeId && formik.errors.employeeId
                )}
                helperText={
                  formik.touched.employeeId && formik.errors.employeeId
                }
              />

              <FormControl fullWidth>
                <InputLabel id="designation-label">Designation</InputLabel>
                <Select
                  labelId="designation-label"
                  id="designation"
                  name="designation"
                  value={formik.values.designation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Designation"
                >
                  <MenuItem value="Assistant Professor">
                    Assistant Professor
                  </MenuItem>
                  <MenuItem value="Associate Professor">
                    Associate Professor
                  </MenuItem>
                  <MenuItem value="Professor">Professor</MenuItem>
                  <MenuItem value="Head of Department">
                    Head of Department
                  </MenuItem>
                  <MenuItem value="Dean">Dean</MenuItem>
                  <MenuItem value="Director">Director</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                id="qualification"
                name="qualification"
                label="Qualification"
                value={formik.values.qualification}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(
                  formik.touched.qualification && formik.errors.qualification
                )}
                helperText={
                  formik.touched.qualification && formik.errors.qualification
                }
              />

              <TextField
                fullWidth
                id="experience"
                name="experience"
                label="Experience (in years)"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={formik.values.experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(
                  formik.touched.experience && formik.errors.experience
                )}
                helperText={
                  formik.touched.experience && formik.errors.experience
                }
              />

              <TextField
                fullWidth
                id="specialization"
                name="specialization"
                label="Specialization"
                value={formik.values.specialization}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(
                  formik.touched.specialization && formik.errors.specialization
                )}
                helperText={
                  formik.touched.specialization && formik.errors.specialization
                }
              />
            </>
          )}

          {/* Password fields */}
          <FormControl
            fullWidth
            error={Boolean(formik.touched.password && formik.errors.password)}
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
              <FormHelperText error>{formik.errors.password}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.confirmPassword && formik.errors.confirmPassword
            )}
          >
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formik.values.confirmPassword}
              name="confirmPassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <FormHelperText error>
                {formik.errors.confirmPassword}
              </FormHelperText>
            )}
          </FormControl>

          {error && (
            <Box>
              <FormHelperText error>{error}</FormHelperText>
            </Box>
          )}

          <Button
            disableElevation
            disabled={loading}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="primary"
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </Stack>
      </form>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Link
          component={RouterLink}
          to="/login"
          variant="body2"
          color="primary"
        >
          Already have an account? Login
        </Link>
      </Box>
    </Box>
  );
};

export default Register; 