import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  IconButton,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Assignment as AssignmentIcon,
  Search as SearchIcon,
  Event as EventIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  DateRange as DateRangeIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';

// Mock attendance data
const MOCK_ATTENDANCE_DATA = {
  currentSemester: '3rd Semester',
  overallAttendance: 86,
  attendanceBySubject: [
    {
      id: 1,
      subject: 'CS301: Data Structures',
      attended: 18,
      total: 20,
      percentage: 90,
      classes: [
        { date: '2023-08-01', status: 'present', topic: 'Introduction to Trees' },
        { date: '2023-08-03', status: 'present', topic: 'Binary Trees' },
        { date: '2023-08-08', status: 'present', topic: 'Binary Search Trees' },
        { date: '2023-08-10', status: 'present', topic: 'Tree Traversals' },
        { date: '2023-08-15', status: 'present', topic: 'AVL Trees' },
        { date: '2023-08-17', status: 'present', topic: 'Red-Black Trees' },
        { date: '2023-08-22', status: 'present', topic: 'B-Trees Introduction' },
        { date: '2023-08-24', status: 'present', topic: 'B-Trees Operations' },
        { date: '2023-08-29', status: 'present', topic: 'Heaps: Introduction' },
        { date: '2023-08-31', status: 'absent', topic: 'Heaps: Operations' },
        { date: '2023-09-05', status: 'present', topic: 'Heap Sort' },
        { date: '2023-09-07', status: 'present', topic: 'Graphs: Introduction' },
        { date: '2023-09-12', status: 'present', topic: 'Graph Representations' },
        { date: '2023-09-14', status: 'present', topic: 'BFS and DFS' },
        { date: '2023-09-19', status: 'present', topic: 'Shortest Path Algorithms' },
        { date: '2023-09-21', status: 'present', topic: 'Minimum Spanning Trees' },
        { date: '2023-09-26', status: 'present', topic: 'Hashing: Introduction' },
        { date: '2023-09-28', status: 'present', topic: 'Hash Functions and Collision Resolution' },
        { date: '2023-10-03', status: 'absent', topic: 'Chaining and Open Addressing' },
        { date: '2023-10-05', status: 'present', topic: 'Review and Practice Problems' },
      ]
    },
    {
      id: 2,
      subject: 'CS302: Algorithm Design',
      attended: 16,
      total: 20,
      percentage: 80,
      classes: [
        { date: '2023-08-02', status: 'present', topic: 'Algorithm Analysis' },
        { date: '2023-08-04', status: 'present', topic: 'Asymptotic Notations' },
        { date: '2023-08-09', status: 'present', topic: 'Divide and Conquer' },
        { date: '2023-08-11', status: 'present', topic: 'Sorting Algorithms' },
        { date: '2023-08-16', status: 'present', topic: 'Merge Sort and Quick Sort' },
        { date: '2023-08-18', status: 'absent', topic: 'Lower Bounds for Sorting' },
        { date: '2023-08-23', status: 'present', topic: 'Linear Time Sorting' },
        { date: '2023-08-25', status: 'present', topic: 'Dynamic Programming: Introduction' },
        { date: '2023-08-30', status: 'present', topic: 'Dynamic Programming: Examples' },
        { date: '2023-09-01', status: 'absent', topic: 'Greedy Algorithms: Introduction' },
        { date: '2023-09-06', status: 'present', topic: 'Greedy Algorithms: Examples' },
        { date: '2023-09-08', status: 'present', topic: 'Amortized Analysis' },
        { date: '2023-09-13', status: 'present', topic: 'Graph Algorithms' },
        { date: '2023-09-15', status: 'present', topic: 'Network Flow Problems' },
        { date: '2023-09-20', status: 'present', topic: 'NP-Completeness' },
        { date: '2023-09-22', status: 'present', topic: 'Approximation Algorithms' },
        { date: '2023-09-27', status: 'absent', topic: 'Randomized Algorithms' },
        { date: '2023-09-29', status: 'present', topic: 'String Matching Algorithms' },
        { date: '2023-10-04', status: 'absent', topic: 'Computational Geometry' },
        { date: '2023-10-06', status: 'present', topic: 'Review Session' },
      ]
    },
    {
      id: 3,
      subject: 'CS303: Database Systems',
      attended: 19,
      total: 20,
      percentage: 95,
      classes: [
        { date: '2023-08-02', status: 'present', topic: 'Introduction to Database Systems' },
        { date: '2023-08-04', status: 'present', topic: 'Data Models' },
        { date: '2023-08-09', status: 'present', topic: 'ER Model' },
        { date: '2023-08-11', status: 'present', topic: 'Relational Model' },
        { date: '2023-08-16', status: 'present', topic: 'Relational Algebra' },
        { date: '2023-08-18', status: 'present', topic: 'SQL Basics' },
        { date: '2023-08-23', status: 'present', topic: 'SQL Advanced Queries' },
        { date: '2023-08-25', status: 'present', topic: 'SQL Constraints and Triggers' },
        { date: '2023-08-30', status: 'present', topic: 'Normalization: 1NF, 2NF' },
        { date: '2023-09-01', status: 'present', topic: 'Normalization: 3NF, BCNF' },
        { date: '2023-09-06', status: 'present', topic: 'Transaction Management' },
        { date: '2023-09-08', status: 'present', topic: 'Concurrency Control' },
        { date: '2023-09-13', status: 'present', topic: 'Database Recovery' },
        { date: '2023-09-15', status: 'present', topic: 'Query Processing' },
        { date: '2023-09-20', status: 'present', topic: 'Query Optimization' },
        { date: '2023-09-22', status: 'present', topic: 'Indexing Techniques' },
        { date: '2023-09-27', status: 'present', topic: 'NoSQL Databases' },
        { date: '2023-09-29', status: 'present', topic: 'Data Warehousing' },
        { date: '2023-10-04', status: 'absent', topic: 'Data Mining Concepts' },
        { date: '2023-10-06', status: 'present', topic: 'Review and Case Studies' },
      ]
    },
    {
      id: 4,
      subject: 'CS304: Computer Networks',
      attended: 15,
      total: 20,
      percentage: 75,
      classes: [
        { date: '2023-08-01', status: 'present', topic: 'Introduction to Computer Networks' },
        { date: '2023-08-03', status: 'present', topic: 'Network Models' },
        { date: '2023-08-08', status: 'present', topic: 'OSI Model' },
        { date: '2023-08-10', status: 'present', topic: 'TCP/IP Model' },
        { date: '2023-08-15', status: 'present', topic: 'Physical Layer' },
        { date: '2023-08-17', status: 'absent', topic: 'Transmission Media' },
        { date: '2023-08-22', status: 'present', topic: 'Data Link Layer' },
        { date: '2023-08-24', status: 'present', topic: 'Error Detection and Correction' },
        { date: '2023-08-29', status: 'present', topic: 'Multiple Access Protocols' },
        { date: '2023-08-31', status: 'absent', topic: 'Network Layer' },
        { date: '2023-09-05', status: 'present', topic: 'IP Addressing' },
        { date: '2023-09-07', status: 'present', topic: 'Routing Algorithms' },
        { date: '2023-09-12', status: 'present', topic: 'Routing Protocols' },
        { date: '2023-09-14', status: 'absent', topic: 'Transport Layer' },
        { date: '2023-09-19', status: 'present', topic: 'TCP and UDP' },
        { date: '2023-09-21', status: 'present', topic: 'Congestion Control' },
        { date: '2023-09-26', status: 'absent', topic: 'Application Layer' },
        { date: '2023-09-28', status: 'present', topic: 'DNS and HTTP' },
        { date: '2023-10-03', status: 'absent', topic: 'Network Security' },
        { date: '2023-10-05', status: 'present', topic: 'Wireless Networks' },
      ]
    },
  ],
  monthlyAttendance: [
    { month: 'Aug 2023', percentage: 90 },
    { month: 'Sep 2023', percentage: 82 },
    { month: 'Oct 2023', percentage: 78 },
  ],
};

const Attendance = () => {
  const { user } = useSelector((state) => state.auth || {});
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Simulate data loading and handle any initialization errors
  useEffect(() => {
    try {
      // Simulate API call with timeout
      const timer = setTimeout(() => {
        setAttendanceData(MOCK_ATTENDANCE_DATA);
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error loading attendance data:", error);
      setSnackbar({
        open: true,
        message: "Error loading attendance data. Please refresh the page.",
        severity: "error"
      });
      setLoading(false);
    }
  }, []);
  
  const handleTabChange = (event, newValue) => {
    try {
      setSelectedTab(newValue);
    } catch (error) {
      console.error("Error changing tabs:", error);
      setSnackbar({
        open: true,
        message: "Error changing tabs. Please try again.",
        severity: "error"
      });
    }
  };
  
  const handleSubjectChange = (event) => {
    try {
      setSelectedSubject(event.target.value);
    } catch (error) {
      console.error("Error changing subject:", error);
      setSnackbar({
        open: true,
        message: "Error changing subject. Please try again.",
        severity: "error"
      });
    }
  };

  const handlePrintReport = () => {
    try {
      setSnackbar({
        open: true,
        message: "Preparing attendance report for printing...",
        severity: "info"
      });
      // In a real app, this would generate a printable report
      setTimeout(() => {
        setSnackbar({
          open: true,
          message: "Print functionality will be available soon.",
          severity: "info"
        });
      }, 1000);
    } catch (error) {
      console.error("Error printing report:", error);
      setSnackbar({
        open: true,
        message: "Error preparing print report. Please try again.",
        severity: "error"
      });
    }
  };

  const handleDownloadReport = () => {
    try {
      setSnackbar({
        open: true,
        message: "Preparing attendance report for download...",
        severity: "info"
      });
      // In a real app, this would generate a downloadable file
      setTimeout(() => {
        setSnackbar({
          open: true,
          message: "Download functionality will be available soon.",
          severity: "info"
        });
      }, 1000);
    } catch (error) {
      console.error("Error downloading report:", error);
      setSnackbar({
        open: true,
        message: "Error preparing download. Please try again.",
        severity: "error"
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({...snackbar, open: false});
  };
  
  // Filter classes based on selected subject
  const getFilteredClasses = () => {
    try {
      if (!attendanceData || !attendanceData.attendanceBySubject) {
        return [];
      }
      
      if (selectedSubject === 'all') {
        return attendanceData.attendanceBySubject.flatMap(subject => 
          (subject.classes || []).map(cls => ({ ...cls, subject: subject.subject }))
        ).sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        const subjectData = attendanceData.attendanceBySubject.find(
          subject => subject.id === parseInt(selectedSubject)
        );
        return subjectData ? (subjectData.classes || []).map(cls => ({ ...cls, subject: subjectData.subject }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
      }
    } catch (error) {
      console.error("Error filtering classes:", error);
      setSnackbar({
        open: true,
        message: "Error filtering attendance data. Please try again.",
        severity: "error"
      });
      return [];
    }
  };
  
  // Apply search filter
  const filteredClasses = getFilteredClasses().filter(cls => {
    try {
      if (!cls) return false;
      return (cls.subject || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (cls.topic || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (cls.date || '').includes(searchTerm || '');
    } catch (error) {
      console.error("Error applying search filter:", error);
      return true; // Return all classes if there's an error
    }
  });
  
  // Format date from YYYY-MM-DD to Month DD, YYYY
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original string if formatting fails
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading attendance data...</Typography>
      </Container>
    );
  }
  
  if (!attendanceData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">Failed to load attendance data</Typography>
          <Typography variant="body1">Please refresh the page or try again later</Typography>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: 4, 
        mb: 4,
        pb: 8,
        height: 'auto',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column'
      }} 
      className="attendance-container"
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CalendarIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Attendance
            </Typography>
          </Box>
          
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 3,
              background: 'linear-gradient(45deg, #FF9800 30%, #FFCA28 90%)',
              color: 'white' 
            }}
          >
            <Typography variant="h6" gutterBottom>
              Current Semester: {attendanceData.currentSemester || 'Current Semester'}
            </Typography>
            <Typography variant="body1">
              Your overall attendance for this semester is {attendanceData.overallAttendance || 0}%
            </Typography>
          </Paper>
        </Grid>
        
        {/* Attendance Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {(attendanceData.attendanceBySubject || []).map(subject => (
              <Grid item xs={12} sm={6} md={3} key={subject.id} sx={{ display: 'flex' }}>
                <Card
                  className="attendance-card"
                  sx={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'visible',
                    boxShadow: (subject.percentage || 0) < 75 ? '0 4px 20px rgba(255, 77, 79, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
                    border: (subject.percentage || 0) < 75 ? '1px solid #ff4d4f' : 'none',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                    <Typography 
                      variant="subtitle1" 
                      component="div" 
                      gutterBottom 
                      noWrap 
                      title={subject.subject}
                      sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2, width: '100%' }}
                    >
                      {subject.subject || 'Unknown Subject'}
                    </Typography>
                    
                    <Box className="progress-container" sx={{ position: 'relative', display: 'flex', justifyContent: 'center', my: 2, height: 80, width: 80, margin: '0 auto' }}>
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={80}
                        thickness={4}
                        sx={{ color: 'grey.300', position: 'absolute', left: 0, top: 0 }}
                      />
                      <CircularProgress
                        variant="determinate"
                        value={subject.percentage || 0}
                        size={80}
                        thickness={4}
                        sx={{
                          color: (subject.percentage || 0) >= 75 ? 'success.main' : 'error.main',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h6" component="div" color="text.secondary">
                          {`${subject.percentage || 0}%`}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, width: '100%' }}>
                      {subject.attended || 0} of {subject.total || 0} classes attended
                    </Typography>
                    
                    {(subject.percentage || 0) < 75 && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1, textAlign: 'center', width: '100%' }}>
                        Attendance below requirement!
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        
        {/* Tabs for different attendance views */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2,
              height: 'auto',
              overflow: 'visible',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={selectedTab} 
                onChange={handleTabChange} 
                variant="fullWidth"
                aria-label="attendance tabs"
              >
                <Tab label="Attendance Log" icon={<EventIcon />} iconPosition="start" />
                <Tab label="Monthly Stats" icon={<DateRangeIcon />} iconPosition="start" />
              </Tabs>
            </Box>
            
            {selectedTab === 0 && (
              <>
                <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={selectedSubject}
                      onChange={handleSubjectChange}
                      label="Subject"
                    >
                      <MenuItem value="all">All Subjects</MenuItem>
                      {(attendanceData.attendanceBySubject || []).map(subject => (
                        <MenuItem key={subject.id} value={subject.id.toString()}>
                          {subject.subject || 'Unknown Subject'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    placeholder="Search by subject, topic, or date"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton 
                      color="primary" 
                      title="Print Attendance Report"
                      onClick={handlePrintReport}
                    >
                      <PrintIcon />
                    </IconButton>
                    <IconButton 
                      color="primary" 
                      title="Download Attendance Report"
                      onClick={handleDownloadReport}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <TableContainer 
                  sx={{ 
                    maxHeight: '60vh', 
                    overflowY: 'auto',
                    border: '1px solid rgba(224, 224, 224, 1)',
                    borderRadius: 1,
                    mb: 3
                  }}
                >
                  <Table stickyHeader aria-label="attendance log table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        {selectedSubject === 'all' && <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>}
                        <TableCell sx={{ fontWeight: 'bold' }}>Topic</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredClasses.length > 0 ? filteredClasses.map((cls, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{formatDate(cls.date || '')}</TableCell>
                          {selectedSubject === 'all' && <TableCell>{cls.subject || ''}</TableCell>}
                          <TableCell>{cls.topic || ''}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              icon={cls.status === 'present' ? <EventAvailableIcon /> : <EventBusyIcon />}
                              label={cls.status === 'present' ? 'Present' : 'Absent'} 
                              color={cls.status === 'present' ? 'success' : 'error'} 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={selectedSubject === 'all' ? 4 : 3} align="center">
                            No attendance records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {filteredClasses.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search or filters
                    </Typography>
                  </Box>
                )}
              </>
            )}
            
            {selectedTab === 1 && (
              <Box sx={{ overflow: 'auto', maxHeight: '70vh' }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Attendance Trends
                </Typography>
                
                <Grid container spacing={3}>
                  {(attendanceData.monthlyAttendance || []).map((month, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {month.month || 'Unknown Month'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={month.percentage || 0} 
                              sx={{ 
                                height: 10, 
                                borderRadius: 5,
                                bgcolor: 'grey.300',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: (month.percentage || 0) >= 75 ? 'success.main' : 'error.main',
                                  borderRadius: 5,
                                }
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {`${month.percentage || 0}%`}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {(month.percentage || 0) >= 75 
                            ? 'Good attendance this month!' 
                            : 'Attendance below required threshold.'}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Semester Attendance Summary
                  </Typography>
                  <TableContainer component={Paper} sx={{ mt: 2, maxHeight: '50vh', overflowY: 'auto' }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Subject</TableCell>
                          <TableCell>Classes Held</TableCell>
                          <TableCell>Classes Attended</TableCell>
                          <TableCell>Percentage</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(attendanceData.attendanceBySubject || []).map((subject) => (
                          <TableRow key={subject.id}>
                            <TableCell>{subject.subject || 'Unknown'}</TableCell>
                            <TableCell>{subject.total || 0}</TableCell>
                            <TableCell>{subject.attended || 0}</TableCell>
                            <TableCell>{subject.percentage || 0}%</TableCell>
                            <TableCell>
                              <Chip 
                                label={(subject.percentage || 0) >= 75 ? 'Good Standing' : 'Attendance Short'} 
                                color={(subject.percentage || 0) >= 75 ? 'success' : 'error'} 
                                size="small" 
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ '& > td': { fontWeight: 'bold', bgcolor: 'rgba(0, 0, 0, 0.04)' } }}>
                          <TableCell>Overall</TableCell>
                          <TableCell>
                            {(() => {
                              try {
                                return (attendanceData.attendanceBySubject || []).reduce((sum, subject) => sum + (subject.total || 0), 0);
                              } catch (error) {
                                console.error("Error calculating total classes:", error);
                                return 0;
                              }
                            })()}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              try {
                                return (attendanceData.attendanceBySubject || []).reduce((sum, subject) => sum + (subject.attended || 0), 0);
                              } catch (error) {
                                console.error("Error calculating attended classes:", error);
                                return 0;
                              }
                            })()}
                          </TableCell>
                          <TableCell>{attendanceData.overallAttendance || 0}%</TableCell>
                          <TableCell>
                            <Chip 
                              label={(attendanceData.overallAttendance || 0) >= 75 ? 'Good Standing' : 'Attendance Short'} 
                              color={(attendanceData.overallAttendance || 0) >= 75 ? 'success' : 'error'} 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Attendance; 