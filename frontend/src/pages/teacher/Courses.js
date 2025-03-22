import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  Badge,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  GroupWork as GroupWorkIcon,
  CalendarToday as CalendarTodayIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Book as BookIcon,
} from '@mui/icons-material';

// Dummy courses data
const DUMMY_COURSES = [
  {
    id: 1,
    code: 'CS201',
    name: 'Data Structures and Algorithms',
    department: 'Computer Science',
    semester: 'Fall 2023',
    students: 45,
    schedule: 'Mon, Wed 10:00 AM - 11:30 AM',
    classroom: 'Room 302, CS Building',
    assignments: 5,
    upcoming: {
      assignment: { title: 'Binary Trees Implementation', dueDate: '2023-04-15' },
      lecture: { title: 'Graph Algorithms', date: '2023-04-10' }
    }
  },
  {
    id: 2,
    code: 'CS301',
    name: 'Database Management Systems',
    department: 'Computer Science',
    semester: 'Fall 2023',
    students: 38,
    schedule: 'Tue, Thu 2:00 PM - 3:30 PM',
    classroom: 'Room 405, CS Building',
    assignments: 3,
    upcoming: {
      assignment: { title: 'Database Normalization Exercise', dueDate: '2023-04-18' },
      lecture: { title: 'Transaction Processing', date: '2023-04-12' }
    }
  },
  {
    id: 3,
    code: 'CS303',
    name: 'Operating Systems',
    department: 'Computer Science',
    semester: 'Fall 2023',
    students: 42,
    schedule: 'Mon, Wed, Fri 1:00 PM - 2:00 PM',
    classroom: 'Room 207, CS Building',
    assignments: 4,
    upcoming: {
      assignment: { title: 'Process Scheduling Algorithms', dueDate: '2023-04-20' },
      lecture: { title: 'Memory Management', date: '2023-04-14' }
    }
  }
];

// Dummy students data (for course details)
const DUMMY_STUDENTS = [
  { id: 1, name: 'John Smith', regNo: 'CS2021001', attendance: 85, avg: 92 },
  { id: 2, name: 'Emily Johnson', regNo: 'CS2021002', attendance: 92, avg: 88 },
  { id: 3, name: 'Michael Brown', regNo: 'CS2021003', attendance: 78, avg: 76 },
  { id: 4, name: 'Jessica Davis', regNo: 'CS2021004', attendance: 90, avg: 85 },
  { id: 5, name: 'James Wilson', regNo: 'CS2021005', attendance: 82, avg: 79 },
];

const Courses = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetailTab, setCourseDetailTab] = useState(0);
  const [announcementText, setAnnouncementText] = useState('');
  const [sending, setSending] = useState(false);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle course card click
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCourseDetailTab(0);
  };

  // Handle close course details
  const handleCloseDetails = () => {
    setSelectedCourse(null);
  };

  // Handle tab change in course details
  const handleCourseTabChange = (event, newValue) => {
    setCourseDetailTab(newValue);
  };

  // Handle announcement text change
  const handleAnnouncementChange = (event) => {
    setAnnouncementText(event.target.value);
  };

  // Handle send announcement
  const handleSendAnnouncement = () => {
    if (!announcementText.trim()) return;
    
    setSending(true);
    
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setAnnouncementText('');
      // Show success notification (would be handled by a notification system in a real app)
    }, 1500);
  };

  // Get attendance status color
  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'success';
    if (attendance >= 75) return 'primary';
    return 'error';
  };

  // Get grade color
  const getGradeColor = (avg) => {
    if (avg >= 85) return 'success';
    if (avg >= 70) return 'primary';
    if (avg >= 60) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              My Courses
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
            >
              Create Course
            </Button>
          </Paper>
        </Grid>

        {/* Course Cards */}
        {DUMMY_COURSES.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course.id}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
                borderTop: '4px solid #1976d2',
              }}
              onClick={() => handleCourseClick(course)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {course.code}
                  </Typography>
                  <Chip
                    label={course.semester}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Typography variant="h5" component="div" gutterBottom>
                  {course.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {course.department}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {course.students} Students
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" noWrap>
                    {course.schedule}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" noWrap>
                    {course.classroom}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Upcoming
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssignmentIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" noWrap>
                    {course.upcoming.assignment.title} (Due: {formatDate(course.upcoming.assignment.dueDate)})
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                  <Typography variant="body2" noWrap>
                    {course.upcoming.lecture.title} ({formatDate(course.upcoming.lecture.date)})
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
                <Button size="small">
                  Manage Students
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Course Details Dialog */}
      <Dialog
        open={!!selectedCourse}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedCourse && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BookIcon sx={{ mr: 1.5 }} color="primary" />
                <Typography variant="h6" component="div">
                  {selectedCourse.code}: {selectedCourse.name}
                </Typography>
              </Box>
              <IconButton
                aria-label="close"
                onClick={handleCloseDetails}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body1">
                      {selectedCourse.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Semester
                    </Typography>
                    <Typography variant="body1">
                      {selectedCourse.semester}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Schedule
                    </Typography>
                    <Typography variant="body1">
                      {selectedCourse.schedule}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Classroom
                    </Typography>
                    <Typography variant="body1">
                      {selectedCourse.classroom}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ width: '100%', mb: 2 }}>
                <Tabs 
                  value={courseDetailTab} 
                  onChange={handleCourseTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Students" />
                  <Tab label="Assignments" />
                  <Tab label="Announcements" />
                  <Tab label="Materials" />
                </Tabs>
              </Box>

              {/* Students Tab */}
              {courseDetailTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Enrolled Students ({DUMMY_STUDENTS.length})
                  </Typography>
                  
                  <List>
                    {DUMMY_STUDENTS.map((student) => (
                      <ListItem 
                        key={student.id}
                        divider
                        secondaryAction={
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Chip 
                              label={`${student.attendance}% Attendance`} 
                              color={getAttendanceColor(student.attendance)}
                              size="small"
                            />
                            <Chip 
                              label={`${student.avg}% Avg.`} 
                              color={getGradeColor(student.avg)}
                              size="small"
                            />
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={student.name} 
                          secondary={`Reg No: ${student.regNo}`} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Assignments Tab */}
              {courseDetailTab === 1 && (
                <Box>
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                      Course Assignments
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      size="small"
                    >
                      New Assignment
                    </Button>
                  </Box>
                  
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Binary Trees Implementation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Due: {formatDate('2023-04-15')}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label="15/45 Submitted" 
                        color="primary" 
                        size="small" 
                        icon={<AssignmentIcon />} 
                      />
                      <Button size="small" variant="outlined">
                        View Submissions
                      </Button>
                    </Box>
                  </Box>
                  
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Sorting Algorithms Comparison
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Due: {formatDate('2023-04-05')}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label="38/45 Submitted" 
                        color="success" 
                        size="small" 
                        icon={<AssignmentIcon />} 
                      />
                      <Button size="small" variant="outlined">
                        View Submissions
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Announcements Tab */}
              {courseDetailTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Class Announcements
                  </Typography>
                  
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', mb: 3 }}>
                    <TextField
                      label="Post an announcement to the class"
                      multiline
                      rows={3}
                      fullWidth
                      variant="outlined"
                      value={announcementText}
                      onChange={handleAnnouncementChange}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        onClick={handleSendAnnouncement}
                        disabled={!announcementText.trim() || sending}
                      >
                        {sending ? 'Sending...' : 'Post Announcement'}
                      </Button>
                    </Box>
                  </Paper>
                  
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Class cancelled tomorrow
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Due to the faculty meeting, our class scheduled for tomorrow will be cancelled. We will cover the topics in the next class.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Posted on {formatDate('2023-04-01')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Additional office hours
                    </Typography>
                    <Typography variant="body2" paragraph>
                      I'll be holding additional office hours this week on Thursday from 3-5pm to help with assignment questions.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Posted on {formatDate('2023-03-28')}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Materials Tab */}
              {courseDetailTab === 3 && (
                <Box>
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                      Course Materials
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      size="small"
                    >
                      Upload Materials
                    </Button>
                  </Box>
                  
                  <List>
                    <ListItem
                      button
                      divider
                    >
                      <ListItemText 
                        primary="Week 8 - Binary Trees Lecture Slides" 
                        secondary={`Uploaded on ${formatDate('2023-04-01')}`} 
                      />
                    </ListItem>
                    <ListItem
                      button
                      divider
                    >
                      <ListItemText 
                        primary="Week 7 - Heap Data Structure" 
                        secondary={`Uploaded on ${formatDate('2023-03-25')}`} 
                      />
                    </ListItem>
                    <ListItem
                      button
                      divider
                    >
                      <ListItemText 
                        primary="Week 6 - Recursion Examples" 
                        secondary={`Uploaded on ${formatDate('2023-03-18')}`} 
                      />
                    </ListItem>
                    <ListItem
                      button
                    >
                      <ListItemText 
                        primary="Week 5 - Sorting Algorithms Implementation" 
                        secondary={`Uploaded on ${formatDate('2023-03-11')}`} 
                      />
                    </ListItem>
                  </List>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Courses; 