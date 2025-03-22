import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';

// Layout components
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard pages
import Dashboard from './pages/Dashboard';

// Student pages
import Profile from './pages/profile/Profile';
import Attendance from './pages/student/Attendance';
import Payments from './pages/student/Payments';
import Results from './pages/student/Results';
import Assignments from './pages/student/Assignments';
import Syllabus from './pages/student/Syllabus';

// Teacher pages
import UploadAttendance from './pages/teacher/UploadAttendance';
import UploadMarks from './pages/teacher/UploadMarks';
import ManageAssignments from './pages/teacher/ManageAssignments';
import SyllabusManagement from './pages/teacher/SyllabusManagement';

// Shared pages
import Messages from './pages/messages/Messages';
import Notices from './pages/notices/Notices';
import Calendar from './pages/calendar/Calendar';
import NotFound from './pages/NotFound';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('App.js: Initial render, checking auth status');
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    console.log('App.js: Auth state changed:', { isAuthenticated, user, loading });
  }, [isAuthenticated, user, loading]);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    console.log('ProtectedRoute: Checking auth status:', { isAuthenticated, loading });
    
    if (loading) {
      console.log('ProtectedRoute: Still loading, showing loading indicator');
      return <div>Loading...</div>;
    }
    
    // Check localStorage first for immediate access
    const localIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated && !localIsAuthenticated) {
      console.log('ProtectedRoute: Not authenticated, redirecting to login');
      return <Navigate to="/login" />;
    }

    console.log('ProtectedRoute: Authenticated, rendering children');
    return children;
  };

  // Role-based protected route
  const RoleRoute = ({ roles, children }) => {
    console.log('RoleRoute: Checking auth and role:', { isAuthenticated, userRole: user?.role, expectedRoles: roles, loading });
    
    if (loading) {
      console.log('RoleRoute: Still loading, showing loading indicator');
      return <div>Loading...</div>;
    }
    
    // Check localStorage first for immediate access
    const localIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // Get user from localStorage if Redux state doesn't have it
    let currentUser = user;
    if (!currentUser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
          console.log('RoleRoute: Using user from localStorage:', currentUser);
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
    }
    
    if (!isAuthenticated && !localIsAuthenticated) {
      console.log('RoleRoute: Not authenticated, redirecting to login');
      return <Navigate to="/login" />;
    }

    if (currentUser && !roles.includes(currentUser.role)) {
      console.log(`RoleRoute: User role (${currentUser.role}) does not match required roles (${roles.join(', ')}), redirecting to dashboard`);
      return <Navigate to="/dashboard" />;
    }
    
    // If we don't have the user yet but we're authenticated, just render the children
    // This allows routing to work while user data is being loaded
    if (!currentUser && (isAuthenticated || localIsAuthenticated)) {
      console.log('RoleRoute: Authenticated but no user data yet, rendering children anyway');
      return children;
    }

    console.log('RoleRoute: User has required role, rendering children');
    return children;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Navigate to="/login" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notices" element={<Notices />} />
        <Route path="calendar" element={<Calendar />} />

        {/* Student Routes */}
        <Route
          path="attendance"
          element={
            <RoleRoute roles={['student']}>
              <Attendance />
            </RoleRoute>
          }
        />
        <Route
          path="payments"
          element={
            <RoleRoute roles={['student']}>
              <Payments />
            </RoleRoute>
          }
        />
        <Route
          path="results"
          element={
            <RoleRoute roles={['student']}>
              <Results />
            </RoleRoute>
          }
        />
        <Route
          path="assignments"
          element={
            <RoleRoute roles={['student']}>
              <Assignments />
            </RoleRoute>
          }
        />
        <Route
          path="syllabus"
          element={
            <RoleRoute roles={['student']}>
              <Syllabus />
            </RoleRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="upload-attendance"
          element={
            <RoleRoute roles={['teacher']}>
              <UploadAttendance />
            </RoleRoute>
          }
        />
        <Route
          path="upload-marks"
          element={
            <RoleRoute roles={['teacher']}>
              <UploadMarks />
            </RoleRoute>
          }
        />
        <Route
          path="manage-assignments"
          element={
            <RoleRoute roles={['teacher']}>
              <ManageAssignments />
            </RoleRoute>
          }
        />
        <Route
          path="syllabus-management"
          element={
            <RoleRoute roles={['teacher']}>
              <SyllabusManagement />
            </RoleRoute>
          }
        />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App; 