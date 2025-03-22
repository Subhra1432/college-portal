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
  const { user } = useSelector((state) => state.auth);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };
  
  // Filter classes based on selected subject
  const getFilteredClasses = () => {
    if (selectedSubject === 'all') {
      return MOCK_ATTENDANCE_DATA.attendanceBySubject.flatMap(subject => 
        subject.classes.map(cls => ({ ...cls, subject: subject.subject }))
      ).sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      const subjectData = MOCK_ATTENDANCE_DATA.attendanceBySubject.find(
        subject => subject.id === parseInt(selectedSubject)
      );
      return subjectData ? subjectData.classes.map(cls => ({ ...cls, subject: subjectData.subject }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
    }
  };
  
  // Apply search filter
  const filteredClasses = getFilteredClasses().filter(cls => 
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.date.includes(searchTerm)
  );
  
  // Format date from YYYY-MM-DD to Month DD, YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
              Current Semester: {MOCK_ATTENDANCE_DATA.currentSemester}
            </Typography>
            <Typography variant="body1">
              Your overall attendance for this semester is {MOCK_ATTENDANCE_DATA.overallAttendance}%
            </Typography>
          </Paper>
        </Grid>
        
        {/* Attendance Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {MOCK_ATTENDANCE_DATA.attendanceBySubject.map(subject => (
              <Grid item xs={12} sm={6} md={3} key={subject.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'visible',
                    boxShadow: subject.percentage < 75 ? '0 4px 20px rgba(255, 77, 79, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
                    border: subject.percentage < 75 ? '1px solid #ff4d4f' : 'none',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      component="div" 
                      gutterBottom 
                      noWrap 
                      title={subject.subject}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {subject.subject}
                    </Typography>
                    
                    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', my: 2 }}>
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={80}
                        thickness={4}
                        sx={{ color: 'grey.300', position: 'absolute' }}
                      />
                      <CircularProgress
                        variant="determinate"
                        value={subject.percentage}
                        size={80}
                        thickness={4}
                        sx={{
                          color: subject.percentage >= 75 ? 'success.main' : 'error.main',
                          position: 'absolute',
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
                          {`${subject.percentage}%`}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" align="center">
                      {subject.attended} of {subject.total} classes attended
                    </Typography>
                    
                    {subject.percentage < 75 && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
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
          <Paper elevation={3} sx={{ p: 3 }}>
            <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Attendance Log" icon={<EventIcon />} iconPosition="start" />
              <Tab label="Monthly Stats" icon={<DateRangeIcon />} iconPosition="start" />
            </Tabs>
            
            {selectedTab === 0 && (
              <>
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={selectedSubject}
                      onChange={handleSubjectChange}
                      label="Subject"
                    >
                      <MenuItem value="all">All Subjects</MenuItem>
                      {MOCK_ATTENDANCE_DATA.attendanceBySubject.map(subject => (
                        <MenuItem key={subject.id} value={subject.id.toString()}>
                          {subject.subject}
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
                    <IconButton color="primary" title="Print Attendance Report">
                      <PrintIcon />
                    </IconButton>
                    <IconButton color="primary" title="Download Attendance Report">
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        {selectedSubject === 'all' && <TableCell>Subject</TableCell>}
                        <TableCell>Topic</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredClasses.map((cls, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{formatDate(cls.date)}</TableCell>
                          {selectedSubject === 'all' && <TableCell>{cls.subject}</TableCell>}
                          <TableCell>{cls.topic}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              icon={cls.status === 'present' ? <EventAvailableIcon /> : <EventBusyIcon />}
                              label={cls.status === 'present' ? 'Present' : 'Absent'} 
                              color={cls.status === 'present' ? 'success' : 'error'} 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {filteredClasses.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No attendance records found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search or filters
                    </Typography>
                  </Box>
                )}
              </>
            )}
            
            {selectedTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Monthly Attendance Trends
                </Typography>
                
                <Grid container spacing={3}>
                  {MOCK_ATTENDANCE_DATA.monthlyAttendance.map((month, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {month.month}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={month.percentage} 
                              sx={{ 
                                height: 10, 
                                borderRadius: 5,
                                bgcolor: 'grey.300',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: month.percentage >= 75 ? 'success.main' : 'error.main',
                                  borderRadius: 5,
                                }
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {`${month.percentage}%`}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {month.percentage >= 75 
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
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
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
                        {MOCK_ATTENDANCE_DATA.attendanceBySubject.map((subject) => (
                          <TableRow key={subject.id}>
                            <TableCell>{subject.subject}</TableCell>
                            <TableCell>{subject.total}</TableCell>
                            <TableCell>{subject.attended}</TableCell>
                            <TableCell>{subject.percentage}%</TableCell>
                            <TableCell>
                              <Chip 
                                label={subject.percentage >= 75 ? 'Good Standing' : 'Attendance Short'} 
                                color={subject.percentage >= 75 ? 'success' : 'error'} 
                                size="small" 
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ '& > td': { fontWeight: 'bold', bgcolor: 'rgba(0, 0, 0, 0.04)' } }}>
                          <TableCell>Overall</TableCell>
                          <TableCell>
                            {MOCK_ATTENDANCE_DATA.attendanceBySubject.reduce((sum, subject) => sum + subject.total, 0)}
                          </TableCell>
                          <TableCell>
                            {MOCK_ATTENDANCE_DATA.attendanceBySubject.reduce((sum, subject) => sum + subject.attended, 0)}
                          </TableCell>
                          <TableCell>{MOCK_ATTENDANCE_DATA.overallAttendance}%</TableCell>
                          <TableCell>
                            <Chip 
                              label={MOCK_ATTENDANCE_DATA.overallAttendance >= 75 ? 'Good Standing' : 'Attendance Short'} 
                              color={MOCK_ATTENDANCE_DATA.overallAttendance >= 75 ? 'success' : 'error'} 
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