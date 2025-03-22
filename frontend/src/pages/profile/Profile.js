import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Enhanced student data with additional fields
  const [studentDetails, setStudentDetails] = useState({
    rollNo: user?.registrationNumber || '23ETCS002141',
    semester: user?.semester || '4 Sem',
    program: user?.program || '002 B.Tech. in CSE',
    section: user?.section || 'Sec-C',
  });
  
  // Set up form state with user data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    // Additional fields based on role
    ...(user?.role === 'student' 
      ? { 
          rollNo: studentDetails.rollNo,
          semester: studentDetails.semester,
          department: user?.department || '',
          program: studentDetails.program,
          section: studentDetails.section,
        } 
      : {
          employeeId: user?.employeeId || '',
          department: user?.department || '',
          qualification: user?.qualification || '',
        }
    )
  });

  useEffect(() => {
    // Update form data if user data changes
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        ...(user.role === 'student'
          ? {
              rollNo: user.registrationNumber || studentDetails.rollNo,
              semester: user.semester || studentDetails.semester,
              department: user.department || prev.department,
              program: user.program || studentDetails.program,
              section: user.section || studentDetails.section,
            }
          : {
              employeeId: user.employeeId || prev.employeeId,
              department: user.department || prev.department,
              qualification: user.qualification || prev.qualification,
            })
      }));
    }
  }, [user, studentDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you'd dispatch an action to update the user profile
    // For now, we'll just simulate success
    setTimeout(() => {
      setIsEditing(false);
      setNotification({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    }, 1000);
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      ...(user?.role === 'student' 
        ? { 
            rollNo: studentDetails.rollNo,
            semester: studentDetails.semester,
            department: user?.department || '',
            program: studentDetails.program,
            section: studentDetails.section,
          } 
        : {
            employeeId: user?.employeeId || '',
            department: user?.department || '',
            qualification: user?.qualification || '',
          }
      )
    });
    setIsEditing(false);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Student ID Card Style Display */}
        {user?.role === 'student' && (
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{
                p: 3,
                maxWidth: 400,
                mx: 'auto',
                mb: 3,
                border: '1px solid #ddd',
                borderRadius: 2,
                bgcolor: '#fff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 130, 
                    borderRadius: 1,
                    mr: 2,
                  }}
                  alt={user?.name}
                  src={user?.profilePicture}
                  variant="square"
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h5" 
                    component="h1" 
                    fontWeight="bold"
                    sx={{ textTransform: 'uppercase' }}
                  >
                    {user?.name || 'SUBHRAKANTA BEHERA'}
                  </Typography>
                  
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      Roll No. :{formData.rollNo}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      {formData.semester}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                      {formData.program}
                    </Typography>
                    <Typography variant="body1">
                      {formData.section}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Profile Header - Teacher */}
        {user?.role !== 'student' && (
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-start' },
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white',
              }}
            >
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: '4px solid white',
                  mb: { xs: 2, md: 0 },
                  mr: { md: 4 }
                }}
                alt={user?.name}
                src={user?.profilePicture}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {user?.name}
                </Typography>
                
                <Typography variant="h6" gutterBottom>
                  {user?.role === 'student' ? 'Student' : 'Teacher'} - {user?.department}
                </Typography>
                
                <Typography variant="body1">
                  {user?.role === 'student' 
                    ? `Registration Number: ${user?.regNumber}` 
                    : `Employee ID: ${user?.employeeId}`}
                </Typography>
              </Box>
              
              {!isEditing && (
                <Button 
                  variant="contained" 
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                    alignSelf: { xs: 'center', md: 'flex-start' },
                    mt: { xs: 2, md: 0 }
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </Paper>
          </Grid>
        )}

        {/* Edit Button for Students */}
        {user?.role === 'student' && !isEditing && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              sx={{ mb: 2 }}
            >
              Edit Profile
            </Button>
          </Grid>
        )}

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                
                {user?.role === 'student' ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Roll Number"
                        name="rollNo"
                        value={formData.rollNo}
                        onChange={handleChange}
                        disabled={true} // Roll number should not be editable
                        variant="filled"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Program"
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Section"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Employee ID"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        disabled={true} // Employee ID should not be editable
                        variant="filled"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Qualification"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                  </>
                )}
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
              </Grid>
              
              {isEditing && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Contact Information Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Email"
                    secondary={user?.email || 'Not provided'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PhoneIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Phone"
                    secondary={user?.phone || 'Not provided'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Role"
                    secondary={user?.role === 'student' ? 'Student' : 'Teacher'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <SchoolIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Department"
                    secondary={user?.department || 'Not assigned'}
                  />
                </ListItem>
                
                {user?.role === 'student' && (
                  <>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <ClassIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Semester"
                        secondary={formData.semester || 'Not assigned'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <ClassIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Section"
                        secondary={formData.section || 'Not assigned'}
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 