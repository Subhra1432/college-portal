import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Grade as GradeIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
  ArrowDropDown as ArrowDropDownIcon,
  MenuBook as MenuBookIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  EventAvailable as EventAvailableIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  
  useEffect(() => {
    // Close drawer on mobile when page changes
    if (isMobile) {
      setOpen(false);
    }
  }, [location, isMobile]);
  
  useEffect(() => {
    console.log('MainLayout - Current user:', user);
    console.log('MainLayout - User role:', user?.role);
    
    // If user data changes in Redux, update the local state
    if (!user) {
      // Check if user data exists in localStorage
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (localUser) {
        console.log('Found user in localStorage:', localUser);
        // Dispatch to update Redux state with user from localStorage
        dispatch({ type: 'auth/setUser', payload: localUser });
      }
    }
  }, [user, dispatch]);
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const toggleDrawer = () => {
    setOpen(!open);
  };
  
  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleProfileMenuClose();
  };
  
  // Get the correct role-specific menu items based on user role
  const getRoleBasedMenuItems = () => {
    const userRole = user?.role || localStorage.getItem('userRole') || 'student';
    console.log('Getting menu items for role:', userRole);
    
    switch(userRole) {
      case 'admin':
        return adminMenuItems || [];
      case 'teacher':
        return teacherMenuItems;
      case 'student':
      default:
        return studentMenuItems;
    }
  };
  
  // Function to determine page title based on path and role
  const getPageTitle = (pathname, role) => {
    // Default title
    let title = 'College Portal';
    
    // Extract the main path segment (e.g., /dashboard/profile -> profile)
    const path = pathname.split('/').filter(p => p)[0];
    
    switch (path) {
      case 'dashboard':
        title = role === 'student' ? 'Student Dashboard' : role === 'teacher' ? 'Teacher Dashboard' : 'Admin Dashboard';
        break;
      case 'profile':
        title = 'User Profile';
        break;
      case 'messages':
        title = 'Messages';
        break;
      case 'notices':
        title = 'Notices & Announcements';
        break;
      case 'calendar':
        title = 'Academic Calendar';
        break;
      case 'student':
        title = 'Student Syllabus';
        break;
      case 'teacher':
        title = 'Syllabus Management';
        break;
      default:
        title = 'College Portal';
    }
    
    return title;
  };
  
  const renderSidebar = () => {
    return (
      <List component="nav">
        {/* Dashboard Link */}
        <ListItem 
          button 
          onClick={() => handleMenuClick('/dashboard')}
          selected={location.pathname === '/dashboard'}
          sx={{
            py: 1.5,
            '&.Mui-selected': {
              bgcolor: 'rgba(0, 0, 0, 0.08)',
            },
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        {/* Role-based menu items */}
        {getRoleBasedMenuItems().map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleMenuClick(item.url)}
            selected={location.pathname === item.url}
            sx={{
              py: 1.5,
              '&.Mui-selected': {
                bgcolor: 'rgba(0, 0, 0, 0.08)',
              },
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
        {/* Common menu items - messaging, notices, calendar */}
        {commonMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleMenuClick(item.path)}
            selected={location.pathname === item.path}
            sx={{
              py: 1.5,
              '&.Mui-selected': {
                bgcolor: 'rgba(0, 0, 0, 0.08)',
              },
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    );
  };

  // Sidebar menu items - Common for all users
  const commonMenuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/dashboard/profile',
    },
    {
      text: 'Messages',
      icon: <MessageIcon />,
      path: '/dashboard/messages',
    },
    {
      text: 'Notices',
      icon: <NotificationsIcon />,
      path: '/dashboard/notices',
    },
    {
      text: 'Calendar',
      icon: <EventIcon />,
      path: '/dashboard/calendar',
    },
  ];

  // Student Menu Items
  const studentMenuItems = [
    {
      id: 'student-dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: <DashboardIcon />,
      text: 'Dashboard',
    },
    {
      id: 'student-courses',
      title: 'Courses',
      type: 'item',
      url: '/dashboard/courses',
      icon: <MenuBookIcon />,
      text: 'Courses',
    },
    {
      id: 'student-syllabus',
      title: 'Syllabus',
      type: 'item',
      url: '/dashboard/syllabus',
      icon: <AssignmentIcon />,
      text: 'Syllabus',
    },
    {
      id: 'student-assignments',
      title: 'Assignments',
      type: 'item',
      url: '/dashboard/assignments',
      icon: <AssignmentIcon />,
      text: 'Assignments',
    },
    {
      id: 'student-grades',
      title: 'Grades',
      type: 'item',
      url: '/dashboard/results',
      icon: <GradeIcon />,
      text: 'Results',
    },
    {
      id: 'student-attendance',
      title: 'Attendance',
      type: 'item',
      url: '/dashboard/attendance',
      icon: <EventAvailableIcon />,
      text: 'Attendance',
    },
  ];

  // Teacher Menu Items
  const teacherMenuItems = [
    {
      id: 'teacher-dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: <DashboardIcon />,
      text: 'Dashboard',
    },
    {
      id: 'teacher-courses',
      title: 'Courses',
      type: 'item',
      url: '/dashboard/courses',
      icon: <MenuBookIcon />,
      text: 'Courses',
    },
    {
      id: 'teacher-syllabus',
      title: 'Syllabus Management',
      type: 'item',
      url: '/dashboard/syllabus-management',
      icon: <AssignmentIcon />,
      text: 'Syllabus Management',
    },
    {
      id: 'teacher-students',
      title: 'Students',
      type: 'item',
      url: '/dashboard/students',
      icon: <PeopleIcon />,
      text: 'Students',
    },
    {
      id: 'teacher-assessments',
      title: 'Assessments',
      type: 'item',
      url: '/dashboard/upload-marks',
      icon: <AssessmentIcon />,
      text: 'Assessments',
    },
    {
      id: 'teacher-attendance',
      title: 'Attendance',
      type: 'item',
      url: '/dashboard/upload-attendance',
      icon: <EventAvailableIcon />,
      text: 'Attendance',
    },
  ];

  // Admin-specific menu items
  const adminMenuItems = [
    {
      text: 'User Management',
      icon: <PersonIcon />,
      path: '/admin/users',
    },
    {
      text: 'Department Management',
      icon: <SchoolIcon />,
      path: '/admin/departments',
    },
    {
      text: 'Course Management',
      icon: <SchoolIcon />,
      path: '/admin/courses',
    },
  ];

  const drawer = (
    <>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 1,
        }}
      >
        <Typography variant="h6" noWrap component="div" color="primary">
          {getPageTitle(location.pathname, user?.role || localStorage.getItem('userRole') || 'student')}
        </Typography>
      </Toolbar>
      <Divider />
      {renderSidebar()}
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.role === 'student' ? 'Student Portal' : 'Teacher Portal'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
            >
              <Avatar sx={{ width: 32, height: 32 }} src={user?.profilePicture}>
                {user?.name?.charAt(0)}
              </Avatar>
              <ArrowDropDownIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                onClick={handleProfileClick}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout; 