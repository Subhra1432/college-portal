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

// Teacher pages
import UploadAttendance from './pages/teacher/UploadAttendance';
import UploadMarks from './pages/teacher/UploadMarks';
import ManageAssignments from './pages/teacher/ManageAssignments';

// Shared pages
import Messages from './pages/messages/Messages';
import Notices from './pages/notices/Notices';
import Calendar from './pages/calendar/Calendar';
import NotFound from './pages/NotFound';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  // Role-based protected route
  const RoleRoute = ({ roles, children }) => {
    if (loading) return <div>Loading...</div>;
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (!roles.includes(user?.role)) {
      return <Navigate to="/dashboard" />;
    }

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
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App; 