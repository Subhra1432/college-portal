import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Event as EventIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

// Dummy attendance data
const DUMMY_ATTENDANCE = [
  {
    subjectId: 'CS101',
    subjectName: 'Introduction to Computer Science',
    totalClasses: 30,
    presentClasses: 28,
    attendance: [
      { date: '2023-03-01', status: 'present' },
      { date: '2023-03-03', status: 'present' },
      { date: '2023-03-05', status: 'present' },
      { date: '2023-03-08', status: 'absent' },
      { date: '2023-03-10', status: 'present' },
      { date: '2023-03-12', status: 'present' },
      { date: '2023-03-15', status: 'present' },
      { date: '2023-03-17', status: 'present' },
      { date: '2023-03-19', status: 'absent' },
      { date: '2023-03-22', status: 'present' },
    ]
  },
  {
    subjectId: 'MA101',
    subjectName: 'Engineering Mathematics',
    totalClasses: 28,
    presentClasses: 24,
    attendance: [
      { date: '2023-03-02', status: 'present' },
      { date: '2023-03-04', status: 'present' },
      { date: '2023-03-09', status: 'absent' },
      { date: '2023-03-11', status: 'present' },
      { date: '2023-03-16', status: 'present' },
      { date: '2023-03-18', status: 'present' },
      { date: '2023-03-23', status: 'absent' },
      { date: '2023-03-25', status: 'present' },
    ]
  },
  {
    subjectId: 'PH101',
    subjectName: 'Engineering Physics',
    totalClasses: 25,
    presentClasses: 22,
    attendance: [
      { date: '2023-03-02', status: 'present' },
      { date: '2023-03-04', status: 'present' },
      { date: '2023-03-09', status: 'present' },
      { date: '2023-03-11', status: 'present' },
      { date: '2023-03-16', status: 'absent' },
      { date: '2023-03-18', status: 'present' },
      { date: '2023-03-23', status: 'present' },
      { date: '2023-03-25', status: 'absent' },
    ]
  },
  {
    subjectId: 'CS102',
    subjectName: 'Data Structures and Algorithms',
    totalClasses: 28,
    presentClasses: 25,
    attendance: [
      { date: '2023-03-01', status: 'present' },
      { date: '2023-03-03', status: 'present' },
      { date: '2023-03-05', status: 'present' },
      { date: '2023-03-08', status: 'present' },
      { date: '2023-03-10', status: 'present' },
      { date: '2023-03-12', status: 'absent' },
      { date: '2023-03-15', status: 'present' },
      { date: '2023-03-17', status: 'absent' },
      { date: '2023-03-19', status: 'present' },
      { date: '2023-03-22', status: 'present' },
    ]
  },
];

const Attendance = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedSubject, setSelectedSubject] = useState('all');
  
  // Calculate overall attendance percentage
  const calculateOverallAttendance = () => {
    let totalClasses = 0;
    let presentClasses = 0;
    
    DUMMY_ATTENDANCE.forEach(subject => {
      totalClasses += subject.totalClasses;
      presentClasses += subject.presentClasses;
    });
    
    return (presentClasses / totalClasses) * 100;
  };
  
  // Get color based on attendance percentage
  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };
  
  // Filter subjects based on selection
  const getFilteredSubjects = () => {
    if (selectedSubject === 'all') {
      return DUMMY_ATTENDANCE;
    }
    return DUMMY_ATTENDANCE.filter(subject => subject.subjectId === selectedSubject);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const overallAttendance = calculateOverallAttendance();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Attendance
          </Typography>
        </Grid>
        
        {/* Attendance Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Overall Attendance
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={overallAttendance} 
                        color={getAttendanceColor(overallAttendance)}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(overallAttendance)}%
                    </Typography>
                  </Box>
                  
                  {overallAttendance < 75 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Your attendance is below 75%. Please ensure regular attendance to maintain eligibility for examinations.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Subject-wise Attendance
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {DUMMY_ATTENDANCE.map(subject => {
                      const percentage = (subject.presentClasses / subject.totalClasses) * 100;
                      return (
                        <Box key={subject.subjectId} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ width: '50%', flexShrink: 0 }}>
                            {subject.subjectName}
                          </Typography>
                          <Box sx={{ width: '40%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={percentage} 
                              color={getAttendanceColor(percentage)}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {Math.round(percentage)}%
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Attendance Details */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Attendance Details
              </Typography>
              
              <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Select Subject</InputLabel>
                <Select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  label="Select Subject"
                >
                  <MenuItem value="all">All Subjects</MenuItem>
                  {DUMMY_ATTENDANCE.map(subject => (
                    <MenuItem key={subject.subjectId} value={subject.subjectId}>
                      {subject.subjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2">Subject</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2">Date</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredSubjects().map(subject => 
                    subject.attendance.map((record, index) => (
                      <TableRow key={`${subject.subjectId}-${index}`}>
                        <TableCell>{subject.subjectName}</TableCell>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>
                          <Chip
                            icon={record.status === 'present' ? <CheckCircleIcon /> : <CancelIcon />}
                            label={record.status === 'present' ? 'Present' : 'Absent'}
                            color={record.status === 'present' ? 'success' : 'error'}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  
                  {getFilteredSubjects().length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography align="center" color="textSecondary">
                          No attendance records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Attendance; 