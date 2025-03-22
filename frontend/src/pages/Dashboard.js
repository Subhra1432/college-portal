import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Stack,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  Grade as GradeIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Shared menu items
  const commonMenuItems = [
    {
      title: 'Profile',
      icon: <PersonIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      description: 'View and edit your profile',
      path: '/dashboard/profile',
    },
    {
      title: 'Messages',
      icon: <MessageIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      description: 'Send and receive messages',
      path: '/dashboard/messages',
    },
    {
      title: 'Notices',
      icon: <NotificationsIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      description: 'View important notices',
      path: '/dashboard/notices',
    },
    {
      title: 'Calendar',
      icon: <EventIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      description: 'View academic calendar',
      path: '/dashboard/calendar',
    },
  ];

  // Student-specific menu items
  const studentMenuItems = [
    {
      title: 'Attendance',
      icon: <SchoolIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      description: 'View your attendance records',
      path: '/dashboard/attendance',
    },
    {
      title: 'Payments',
      icon: <PaymentIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      description: 'View and make payments',
      path: '/dashboard/payments',
    },
    {
      title: 'Results',
      icon: <GradeIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      description: 'View your academic results',
      path: '/dashboard/results',
    },
    {
      title: 'Assignments',
      icon: <AssignmentIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      description: 'View and submit assignments',
      path: '/dashboard/assignments',
    },
  ];

  // Teacher-specific menu items
  const teacherMenuItems = [
    {
      title: 'Upload Attendance',
      icon: <SchoolIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      description: 'Manage student attendance',
      path: '/dashboard/upload-attendance',
    },
    {
      title: 'Upload Marks',
      icon: <GradeIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      description: 'Upload student marks',
      path: '/dashboard/upload-marks',
    },
    {
      title: 'Manage Assignments',
      icon: <AssignmentIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      description: 'Create and grade assignments',
      path: '/dashboard/manage-assignments',
    },
  ];

  // Get role-specific menu items
  const roleBasedMenuItems =
    user?.role === 'student' ? studentMenuItems : teacherMenuItems;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: 'white',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{ width: 72, height: 72, bgcolor: 'white' }}
              src={user?.profilePicture}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs={12} sm>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, {user?.name}!
            </Typography>
            <Typography variant="subtitle1">
              {user?.role === 'student'
                ? `Student | ${user?.department} | Semester: ${user?.semester}`
                : `${user?.designation} | ${user?.department}`}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Quick Actions
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {commonMenuItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardActionArea
                  onClick={() => navigate(item.path)}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Stack
                      spacing={2}
                      direction="column"
                      alignItems="center"
                      textAlign="center"
                    >
                      {item.icon}
                      <Typography variant="h6" component="div">
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ flexGrow: 1 }}
                      >
                        {item.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {user?.role === 'student' ? 'Academic Tools' : 'Teaching Tools'}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {roleBasedMenuItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardActionArea
                  onClick={() => navigate(item.path)}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Stack
                      spacing={2}
                      direction="column"
                      alignItems="center"
                      textAlign="center"
                    >
                      {item.icon}
                      <Typography variant="h6" component="div">
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ flexGrow: 1 }}
                      >
                        {item.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 