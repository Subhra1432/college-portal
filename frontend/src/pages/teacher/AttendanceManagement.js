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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  Save as SaveIcon,
  History as HistoryIcon,
  CalendarToday as CalendarTodayIcon,
  School as SchoolIcon,
  GroupWork as GroupWorkIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';

// Dummy courses data
const DUMMY_COURSES = [
  {
    id: 1,
    code: 'CS201',
    name: 'Data Structures and Algorithms',
    semester: 'Fall 2023',
    students: 45,
  },
  {
    id: 2,
    code: 'CS301',
    name: 'Database Management Systems',
    semester: 'Fall 2023',
    students: 38,
  },
  {
    id: 3,
    code: 'CS303',
    name: 'Operating Systems',
    semester: 'Fall 2023',
    students: 42,
  }
];

// Dummy students data
const DUMMY_STUDENTS = [
  { id: 1, name: 'John Smith', regNo: 'CS2021001', totalAttendance: 85 },
  { id: 2, name: 'Emily Johnson', regNo: 'CS2021002', totalAttendance: 92 },
  { id: 3, name: 'Michael Brown', regNo: 'CS2021003', totalAttendance: 78 },
  { id: 4, name: 'Jessica Davis', regNo: 'CS2021004', totalAttendance: 90 },
  { id: 5, name: 'James Wilson', regNo: 'CS2021005', totalAttendance: 82 },
  { id: 6, name: 'Emma Martinez', regNo: 'CS2021006', totalAttendance: 94 },
  { id: 7, name: 'William Taylor', regNo: 'CS2021007', totalAttendance: 80 },
  { id: 8, name: 'Olivia Thomas', regNo: 'CS2021008', totalAttendance: 87 },
  { id: 9, name: 'Benjamin Anderson', regNo: 'CS2021009', totalAttendance: 75 },
  { id: 10, name: 'Sophia Jackson', regNo: 'CS2021010', totalAttendance: 89 },
];

// Dummy attendance history dates
const ATTENDANCE_DATES = [
  '2023-04-03', '2023-04-01', '2023-03-29', '2023-03-27', 
  '2023-03-24', '2023-03-22', '2023-03-20', '2023-03-17'
];

const AttendanceManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Handle course selection
  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);
    
    if (courseId) {
      // In a real app, this would fetch students for the selected course
      // For this demo, we'll use the dummy data
      const initialAttendance = DUMMY_STUDENTS.map(student => ({
        ...student,
        present: true, // Default all students as present
        remarks: ''
      }));
      
      setAttendanceData(initialAttendance);
    } else {
      setAttendanceData([]);
    }
  };
  
  // Handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  
  // Handle attendance change
  const handleAttendanceChange = (studentId) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, present: !student.present } 
          : student
      )
    );
  };
  
  // Handle remarks change
  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, remarks } 
          : student
      )
    );
  };
  
  // Handle save attendance
  const handleSaveAttendance = () => {
    setSavingAttendance(true);
    
    // Simulate API call
    setTimeout(() => {
      setSavingAttendance(false);
      setShowNotification(true);
    }, 1500);
  };
  
  // Handle close notification
  const handleCloseNotification = () => {
    setShowNotification(false);
  };
  
  // Handle open history
  const handleOpenHistory = () => {
    setHistoryOpen(true);
  };
  
  // Handle close history
  const handleCloseHistory = () => {
    setHistoryOpen(false);
    setSelectedHistoryDate('');
  };
  
  // Handle history date selection
  const handleHistoryDateSelect = (date) => {
    setSelectedHistoryDate(date);
  };
  
  // Get attendance status chip color
  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'success';
    if (attendance >= 75) return 'primary';
    return 'error';
  };
  
  // Get the selected course object
  const getCourseDetails = () => {
    return DUMMY_COURSES.find(course => course.id === selectedCourse);
  };
  
  // Calculate present students
  const getPresentCount = () => {
    return attendanceData.filter(student => student.present).length;
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage student attendance for your courses
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Course Selection */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="course-select-label">Select Course</InputLabel>
              <Select
                labelId="course-select-label"
                id="course-select"
                value={selectedCourse}
                onChange={handleCourseChange}
                label="Select Course"
              >
                <MenuItem value="">
                  <em>Select a course</em>
                </MenuItem>
                {DUMMY_COURSES.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {`${course.code}: ${course.name}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>
        
        {/* Date Selection */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="date-select"
                label="Attendance Date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Paper>
        </Grid>
        
        {/* Attendance History Button */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <Button
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={handleOpenHistory}
              disabled={!selectedCourse}
              fullWidth
            >
              View Attendance History
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      {selectedCourse ? (
        <>
          {/* Course Summary */}
          <Paper sx={{ p: 2, mt: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon color="primary" sx={{ mr: 1.5, fontSize: 30 }} />
              <Typography variant="h5">
                {getCourseDetails()?.code}: {getCourseDetails()?.name}
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {formatDate(selectedDate)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GroupWorkIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {getCourseDetails()?.semester}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Total Students: {getCourseDetails()?.students}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Attendance Table */}
          <Paper sx={{ p: 2, mb: 3, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Mark Attendance
              </Typography>
              <Box>
                <Chip 
                  label={`Present: ${getPresentCount()}/${attendanceData.length}`} 
                  color="primary" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={`Absent: ${attendanceData.length - getPresentCount()}/${attendanceData.length}`} 
                  color="error" 
                />
              </Box>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="5%">#</TableCell>
                    <TableCell width="15%">Reg No</TableCell>
                    <TableCell width="20%">Student Name</TableCell>
                    <TableCell width="10%" align="center">Status</TableCell>
                    <TableCell width="15%" align="center">Overall Attendance</TableCell>
                    <TableCell width="35%">Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.regNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={student.present}
                          onChange={() => handleAttendanceChange(student.id)}
                          color={student.present ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${student.totalAttendance}%`}
                          color={getAttendanceColor(student.totalAttendance)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          placeholder="Add remarks (optional)"
                          value={student.remarks}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={savingAttendance ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSaveAttendance}
                disabled={savingAttendance}
              >
                {savingAttendance ? 'Saving...' : 'Save Attendance'}
              </Button>
            </Box>
          </Paper>
        </>
      ) : (
        <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Select a course to manage attendance
          </Typography>
        </Paper>
      )}
      
      {/* Attendance History Dialog */}
      <Dialog
        open={historyOpen}
        onClose={handleCloseHistory}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Attendance History
          <IconButton
            aria-label="close"
            onClick={handleCloseHistory}
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
          {selectedCourse && (
            <>
              <Typography variant="h6" gutterBottom>
                {getCourseDetails()?.code}: {getCourseDetails()?.name}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom>
                    Select Date
                  </Typography>
                  <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, maxHeight: 400, overflow: 'auto' }}>
                    {ATTENDANCE_DATES.map((date) => (
                      <Box 
                        key={date}
                        sx={{ 
                          p: 1.5, 
                          cursor: 'pointer',
                          bgcolor: selectedHistoryDate === date ? 'primary.light' : 'transparent',
                          color: selectedHistoryDate === date ? 'primary.contrastText' : 'inherit',
                          '&:hover': {
                            bgcolor: selectedHistoryDate === date ? 'primary.light' : 'action.hover',
                          },
                          borderRadius: 1,
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onClick={() => handleHistoryDateSelect(date)}
                      >
                        <DateRangeIcon sx={{ mr: 1.5 }} />
                        <Typography variant="body2">
                          {formatDate(date)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  {selectedHistoryDate ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1">
                          Attendance for {formatDate(selectedHistoryDate)}
                        </Typography>
                        <Button 
                          size="small"
                          startIcon={<PdfIcon />}
                        >
                          Export as PDF
                        </Button>
                      </Box>
                      
                      <TableContainer sx={{ maxHeight: 350, overflow: 'auto' }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Reg No</TableCell>
                              <TableCell>Student Name</TableCell>
                              <TableCell align="center">Status</TableCell>
                              <TableCell>Remarks</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {attendanceData.map((student) => (
                              <TableRow key={student.id}>
                                <TableCell>{student.regNo}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={Math.random() > 0.2 ? 'Present' : 'Absent'}
                                    color={Math.random() > 0.2 ? 'success' : 'error'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  {Math.random() > 0.7 ? 'Late arrival' : ''}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography variant="body1" color="text.secondary">
                        Select a date to view attendance
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistory}>Close</Button>
          {selectedHistoryDate && (
            <Button
              startIcon={<FileDownloadIcon />}
              variant="contained"
            >
              Download Report
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Success Notification */}
      <Snackbar
        open={showNotification}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Attendance saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AttendanceManagement; 