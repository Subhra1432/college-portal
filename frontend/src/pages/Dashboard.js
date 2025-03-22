import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Grid, Typography, Paper, Box, Button } from '@mui/material';
import { School as SchoolIcon, MenuBook as MenuBookIcon, Assignment as AssignmentIcon } from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  useEffect(() => {
    console.log('Dashboard component - Current user:', user);
    console.log('Dashboard component - isAuthenticated:', isAuthenticated);
    console.log('Dashboard component - User role:', user?.role);
    
    // If not authenticated, redirect to login
    if (!isAuthenticated && !localStorage.getItem('isAuthenticated')) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated, user]);
  
  const handleNavigate = (path) => {
    navigate(path);
  };
  
  // Determine which dashboard to show based on user role
  const renderDashboard = () => {
    const userRole = user?.role || localStorage.getItem('userRole') || 'student';
    console.log('Rendering dashboard for role:', userRole);
    
    switch(userRole) {
      case 'admin':
        return renderAdminDashboard();
      case 'teacher':
        return renderTeacherDashboard();
      case 'student':
      default:
        return renderStudentDashboard();
    }
  };
  
  const renderStudentDashboard = () => {
    return (
      <>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Welcome, {user?.name || 'Student'}!
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleNavigate('/student/courses')}
            >
              <MenuBookIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                My Courses
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                View your enrolled courses, materials, and assignments
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleNavigate('/student/attendance')}
            >
              <AssignmentIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Attendance
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Check your attendance records for all courses
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleNavigate('/student/results')}
            >
              <SchoolIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Results
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                View your academic results and performance
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };
  
  const renderTeacherDashboard = () => {
    return (
      <>
        <Typography variant="h4" component="h1" gutterBottom>
          Teacher Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Welcome, {user?.name || 'Teacher'}!
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Teacher dashboard tiles */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleNavigate('/teacher/courses')}
            >
              <MenuBookIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Manage Courses
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                View and manage your assigned courses
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleNavigate('/teacher/upload-attendance')}
            >
              <AssignmentIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Attendance
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Upload and manage student attendance
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleNavigate('/teacher/upload-marks')}
            >
              <SchoolIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Upload Marks
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Upload and manage student marks and grades
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };
  
  const renderAdminDashboard = () => {
    return (
      <>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Welcome, {user?.name || 'Admin'}!
        </Typography>
        
        <Typography variant="body1" paragraph>
          From here you can manage the college portal system.
        </Typography>
        
        {/* Add admin-specific dashboard content here */}
      </>
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {renderDashboard()}
    </Container>
  );
};

export default Dashboard; 