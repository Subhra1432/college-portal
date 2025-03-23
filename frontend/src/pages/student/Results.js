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
  Divider,
  Tabs,
  Tab,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  LinearProgress,
  IconButton,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
  Star as StarIcon,
  Grade as GradeIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';

// Mock results data
const MOCK_RESULTS = {
  student: {
    id: 'CS2023001',
    name: 'John Smith',
    program: 'B.Tech',
    department: 'Computer Science and Engineering',
    batch: '2022-2026',
    currentSemester: 3,
  },
  currentCGPA: 8.75,
  semesters: [
    {
      semesterNumber: 1,
      year: '2022',
      term: 'Fall',
      sgpa: 8.5,
      status: 'Completed',
      courses: [
        { code: 'CS101', name: 'Introduction to Programming', credits: 4, grade: 'A', points: 9 },
        { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, grade: 'A', points: 9 },
        { code: 'PH101', name: 'Engineering Physics', credits: 3, grade: 'B+', points: 8 },
        { code: 'HS101', name: 'Communication Skills', credits: 2, grade: 'A', points: 9 },
        { code: 'ES101', name: 'Engineering Drawing', credits: 3, grade: 'B', points: 7 },
      ],
    },
    {
      semesterNumber: 2,
      year: '2023',
      term: 'Spring',
      sgpa: 9.0,
      status: 'Completed',
      courses: [
        { code: 'CS102', name: 'Data Structures', credits: 4, grade: 'A+', points: 10 },
        { code: 'MA102', name: 'Engineering Mathematics II', credits: 4, grade: 'A', points: 9 },
        { code: 'EC101', name: 'Basic Electronics', credits: 3, grade: 'A', points: 9 },
        { code: 'CS103', name: 'Computer Organization', credits: 3, grade: 'A-', points: 8 },
        { code: 'HS102', name: 'Professional Ethics', credits: 2, grade: 'B+', points: 8 },
      ],
    },
    {
      semesterNumber: 3,
      year: '2023',
      term: 'Fall',
      sgpa: 8.75,
      status: 'In Progress',
      courses: [
        { code: 'CS201', name: 'Algorithm Design', credits: 4, grade: 'A', points: 9 },
        { code: 'CS202', name: 'Database Systems', credits: 4, grade: 'A-', points: 8 },
        { code: 'CS203', name: 'Operating Systems', credits: 3, grade: 'B+', points: 8 },
        { code: 'CS204', name: 'Computer Networks', credits: 3, grade: 'A', points: 9 },
        { code: 'HS201', name: 'Economics for Engineers', credits: 2, grade: 'A+', points: 10 },
      ],
    },
  ],
  overallProgress: {
    totalCreditsRequired: 160,
    totalCreditsPassed: 45,
    currentCredits: 16,
    completionPercentage: 28.13,
  },
  gradeDistribution: {
    'A+': 2,
    'A': 6,
    'A-': 2,
    'B+': 3,
    'B': 1,
    'B-': 0,
    'C+': 0,
    'C': 0,
    'D': 0,
    'F': 0,
  },
};

const Results = () => {
  const { user } = useSelector((state) => state.auth || {});
  const [selectedTab, setSelectedTab] = useState(0);
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(3); // Default to semester 3
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
        setResultsData(MOCK_RESULTS);
        setSelectedSemester(MOCK_RESULTS.student?.currentSemester || 3);
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error loading results data:", error);
      setSnackbar({
        open: true,
        message: "Error loading results data. Please refresh the page.",
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
  
  const handleSemesterChange = (event) => {
    try {
      setSelectedSemester(event.target.value);
    } catch (error) {
      console.error("Error changing semester:", error);
      setSnackbar({
        open: true,
        message: "Error changing semester. Please try again.",
        severity: "error"
      });
    }
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Functions to get grade color
  const getGradeColor = (grade) => {
    if (!grade) return 'text.primary';
    if (grade.startsWith('A')) return 'success.main';
    if (grade.startsWith('B')) return 'info.main';
    if (grade.startsWith('C')) return 'warning.main';
    return 'error.main';
  };
  
  // Format semester title
  const formatSemesterTitle = (semester) => {
    if (!semester) return 'Unknown Semester';
    return `Semester ${semester.semesterNumber} (${semester.term || 'Unknown'} ${semester.year || 'Unknown'})`;
  };
  
  // Calculate total credits and total points for a semester
  const calculateSemesterTotals = (semester) => {
    try {
      if (!semester || !semester.courses) {
        return { totalCredits: 0, totalPoints: 0 };
      }
      
      const totalCredits = semester.courses.reduce((sum, course) => sum + (course.credits || 0), 0);
      const totalPoints = semester.courses.reduce((sum, course) => sum + ((course.credits || 0) * (course.points || 0)), 0);
      return { totalCredits, totalPoints };
    } catch (error) {
      console.error("Error calculating semester totals:", error);
      return { totalCredits: 0, totalPoints: 0 };
    }
  };
  
  // Get grade description
  const getGradeDescription = (grade) => {
    if (!grade) return '';
    
    const descriptions = {
      'A+': 'Outstanding',
      'A': 'Excellent',
      'A-': 'Very Good',
      'B+': 'Good',
      'B': 'Above Average',
      'B-': 'Average',
      'C+': 'Satisfactory',
      'C': 'Sufficient',
      'D': 'Pass',
      'F': 'Fail',
    };
    return descriptions[grade] || '';
  };
  
  // Get semester performance trend
  const getSemesterTrend = () => {
    try {
      if (!resultsData || !resultsData.semesters || resultsData.semesters.length < 2) {
        return 'neutral';
      }
      
      const lastTwoSemesters = resultsData.semesters.slice(-2);
      if (!lastTwoSemesters[0].sgpa || !lastTwoSemesters[1].sgpa) {
        return 'neutral';
      }
      
      const diff = lastTwoSemesters[1].sgpa - lastTwoSemesters[0].sgpa;
      
      if (diff > 0.2) return 'up';
      if (diff < -0.2) return 'down';
      return 'neutral';
    } catch (error) {
      console.error("Error calculating semester trend:", error);
      return 'neutral';
    }
  };
  
  // Get the currently selected semester data
  const getCurrentSemesterData = () => {
    try {
      if (!resultsData || !resultsData.semesters) {
        return null;
      }
      
      return resultsData.semesters.find(
        semester => semester.semesterNumber === selectedSemester
      );
    } catch (error) {
      console.error("Error getting current semester data:", error);
      return null;
    }
  };
  
  const semesterTrend = getSemesterTrend();
  const currentSemesterData = getCurrentSemesterData();
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading results data...</Typography>
      </Container>
    );
  }
  
  if (!resultsData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">Failed to load results data</Typography>
          <Typography variant="body1">Please refresh the page or try again later</Typography>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pb: 8, overflow: 'visible', height: 'auto' }} className="results-container">
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
            <AssessmentIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Academic Results
            </Typography>
          </Box>
        </Grid>
        
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GradeIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Current CGPA
                </Typography>
              </Box>
              <Typography variant="h3" component="div" gutterBottom>
                {(resultsData.currentCGPA || 0).toFixed(2)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {semesterTrend === 'up' && <TrendingUpIcon color="inherit" sx={{ mr: 0.5 }} />}
                {semesterTrend === 'down' && <TrendingDownIcon color="inherit" sx={{ mr: 0.5 }} />}
                {semesterTrend === 'neutral' && <TimelineIcon color="inherit" sx={{ mr: 0.5 }} />}
                <Typography variant="body2">
                  {semesterTrend === 'up' && 'Improving trend'}
                  {semesterTrend === 'down' && 'Declining trend'}
                  {semesterTrend === 'neutral' && 'Stable performance'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column' 
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" color="primary">
                  Program Progress
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {((resultsData.overallProgress?.completionPercentage) || 0).toFixed(1)}% Completed
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(resultsData.overallProgress?.completionPercentage) || 0} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2">
                <strong>{resultsData.overallProgress?.totalCreditsPassed || 0}</strong> of <strong>{resultsData.overallProgress?.totalCreditsRequired || 0}</strong> credits completed
              </Typography>
              <Typography variant="body2">
                <strong>{resultsData.overallProgress?.currentCredits || 0}</strong> credits in progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column' 
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEventsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" color="primary">
                  Academic Achievements
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Top grades:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<StarIcon />} 
                  label={`${resultsData.gradeDistribution?.['A+'] || 0} A+ Grades`} 
                  color="success" 
                  size="small" 
                />
                <Chip 
                  icon={<StarIcon />} 
                  label={`${resultsData.gradeDistribution?.['A'] || 0} A Grades`} 
                  color="success" 
                  size="small" 
                />
                <Chip 
                  icon={<StarIcon />} 
                  label={`${resultsData.gradeDistribution?.['A-'] || 0} A- Grades`} 
                  color="success" 
                  size="small" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Tabs for Semester Results and Performance */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              overflow: 'visible',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
            className="results-tabs-container"
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={selectedTab} 
                onChange={handleTabChange} 
                variant="fullWidth"
                aria-label="results tabs"
              >
                <Tab label="Semester Results" icon={<AssessmentIcon />} iconPosition="start" id="results-tab-0" aria-controls="results-tabpanel-0" />
                <Tab label="Overall Performance" icon={<TimelineIcon />} iconPosition="start" id="results-tab-1" aria-controls="results-tabpanel-1" />
              </Tabs>
            </Box>
            
            <Box
              role="tabpanel"
              hidden={selectedTab !== 0}
              id="results-tabpanel-0"
              aria-labelledby="results-tab-0"
              sx={{ 
                flexGrow: 1, 
                overflow: 'visible',
                display: selectedTab === 0 ? 'block' : 'none'
              }}
              className="semester-results-tab"
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControl sx={{ minWidth: 250 }}>
                  <InputLabel>Select Semester</InputLabel>
                  <Select
                    value={selectedSemester}
                    onChange={handleSemesterChange}
                    label="Select Semester"
                  >
                    {(resultsData.semesters || []).map((semester) => (
                      <MenuItem key={semester.semesterNumber} value={semester.semesterNumber}>
                        {formatSemesterTitle(semester)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Box>
                  <IconButton 
                    color="primary" 
                    title="Print Results"
                    onClick={() => {
                      setSnackbar({
                        open: true,
                        message: "Print functionality will be available soon.",
                        severity: "info"
                      });
                    }}
                  >
                    <PrintIcon />
                  </IconButton>
                  <IconButton 
                    color="primary" 
                    title="Download Results"
                    onClick={() => {
                      setSnackbar({
                        open: true,
                        message: "Download functionality will be available soon.",
                        severity: "info"
                      });
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Box>
              </Box>
              
              {currentSemesterData ? (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6">
                      {formatSemesterTitle(currentSemesterData)}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Chip 
                        label={`SGPA: ${(currentSemesterData.sgpa || 0).toFixed(2)}`} 
                        color="primary" 
                      />
                      <Chip 
                        label={`Status: ${currentSemesterData.status || 'Unknown'}`} 
                        color={currentSemesterData.status === 'Completed' ? 'success' : 'info'} 
                      />
                    </Box>
                  </Box>
                  
                  <TableContainer sx={{ maxHeight: '60vh', overflowY: 'auto', border: '1px solid rgba(224, 224, 224, 1)', borderRadius: 1, mb: 3 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Course Code</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Course Name</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>Credits</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Grade Points</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Credit Points</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(currentSemesterData.courses || []).map((course) => (
                          <TableRow key={course.code} hover>
                            <TableCell>{course.code || ''}</TableCell>
                            <TableCell>{course.name || ''}</TableCell>
                            <TableCell align="center">{course.credits || 0}</TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={course.grade || 'N/A'} 
                                size="small" 
                                sx={{ 
                                  bgcolor: getGradeColor(course.grade),
                                  color: 'white',
                                  fontWeight: 'bold',
                                }} 
                              />
                            </TableCell>
                            <TableCell>{(course.points || 0)} - {getGradeDescription(course.grade)}</TableCell>
                            <TableCell align="right">{(course.credits || 0) * (course.points || 0)}</TableCell>
                          </TableRow>
                        ))}
                        
                        {/* Summary row */}
                        <TableRow sx={{ '& td': { fontWeight: 'bold', bgcolor: 'rgba(0, 0, 0, 0.04)' } }}>
                          <TableCell colSpan={2}>Semester Totals</TableCell>
                          <TableCell align="center">{calculateSemesterTotals(currentSemesterData).totalCredits}</TableCell>
                          <TableCell align="center">SGPA: {(currentSemesterData.sgpa || 0).toFixed(2)}</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell align="right">{calculateSemesterTotals(currentSemesterData).totalPoints}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      * SGPA = Total Credit Points / Total Credits
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      * Grade Points: A+ (10), A (9), A- (8), B+ (7), B (6), B- (5), C+ (4), C (3), D (2), F (0)
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box className="no-data-alert">
                  <Typography variant="body1" color="error">
                    No data available for the selected semester
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box
              role="tabpanel"
              hidden={selectedTab !== 1}
              id="results-tabpanel-1"
              aria-labelledby="results-tab-1"
              sx={{ 
                flexGrow: 1, 
                overflow: 'visible',
                display: selectedTab === 1 ? 'flex' : 'none',
                flexDirection: 'column',
                minHeight: '600px',
                height: 'auto',
                position: 'relative',
                visibility: 'visible',
                width: '100%'
              }}
              className="overall-performance-tab"
            >
              <Paper elevation={0} sx={{ 
                p: 0, 
                overflow: 'visible', 
                height: 'auto',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                visibility: 'visible'
              }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Cumulative Performance
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Below is a summary of your performance across all semesters.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <TableContainer 
                    component={Paper} 
                    elevation={1}
                    sx={{ 
                      maxHeight: '300px', 
                      overflowY: 'auto', 
                      border: '1px solid rgba(224, 224, 224, 1)', 
                      borderRadius: 1,
                      position: 'relative',
                      visibility: 'visible',
                      width: '100%',
                      zIndex: 1
                    }}
                  >
                    <Table stickyHeader size="small" sx={{ visibility: 'visible', position: 'relative' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', minWidth: 180 }}>Semester</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 150 }}>Credits Attempted</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 100 }}>SGPA</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold', minWidth: 150 }}>Cumulative GPA</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(resultsData.semesters || []).map((semester, index) => {
                          // Calculate running CGPA using IIFE to handle any errors
                          const runningCGPA = (() => {
                            try {
                              if (!resultsData.semesters) return 0;
                              
                              const semestersToConsider = resultsData.semesters.slice(0, index + 1);
                              const totalWeightedPoints = semestersToConsider.reduce((total, sem) => {
                                const weight = calculateSemesterTotals(sem).totalCredits;
                                return total + ((sem.sgpa || 0) * weight);
                              }, 0);
                              
                              const totalCredits = semestersToConsider.reduce((total, sem) => 
                                total + calculateSemesterTotals(sem).totalCredits, 0);
                                
                              return totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
                            } catch (error) {
                              console.error("Error calculating running CGPA:", error);
                              return 0;
                            }
                          })();
                              
                          return (
                            <TableRow key={semester.semesterNumber} hover>
                              <TableCell>{formatSemesterTitle(semester)}</TableCell>
                              <TableCell align="center">{calculateSemesterTotals(semester).totalCredits}</TableCell>
                              <TableCell align="center">
                                <Chip 
                                  label={(semester.sgpa || 0).toFixed(2)} 
                                  size="small" 
                                  color={
                                    (semester.sgpa || 0) >= 9 ? 'success' : 
                                    (semester.sgpa || 0) >= 8 ? 'primary' : 
                                    (semester.sgpa || 0) >= 7 ? 'info' : 
                                    (semester.sgpa || 0) >= 6 ? 'warning' : 'error'
                                  } 
                                />
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={semester.status || 'Unknown'} 
                                  size="small" 
                                  color={semester.status === 'Completed' ? 'success' : 'info'} 
                                />
                              </TableCell>
                              <TableCell align="right">{runningCGPA.toFixed(2)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Box sx={{ mb: 3, mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Grade Distribution
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Summary of grades earned across all completed courses.
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ 
                    mt: 2,
                    width: '100%'
                  }}>
                    {Object.entries(resultsData.gradeDistribution || {}).map(([grade, count]) => (
                      grade && (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={grade}>
                          <Card 
                            elevation={2} 
                            sx={{ 
                              textAlign: 'center', 
                              py: 2,
                              px: 1,
                              minHeight: '120px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                            className="grade-card"
                          >
                            <Typography 
                              variant="h4" 
                              sx={{ 
                                color: getGradeColor(grade),
                                fontWeight: 'bold',
                                mb: 1
                              }}
                            >
                              {grade}
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 0.5 }}>
                              {count || 0}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {count === 1 ? 'course' : 'courses'}
                            </Typography>
                          </Card>
                        </Grid>
                      )
                    ))}
                  </Grid>
                </Box>
                
                <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      setSnackbar({
                        open: true,
                        message: "Download functionality will be available soon.",
                        severity: "info"
                      });
                    }}
                  >
                    Download Complete Transcript
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Results; 