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
  const { user } = useSelector((state) => state.auth);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState(MOCK_RESULTS.currentSemester);
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };
  
  // Get the currently selected semester data
  const currentSemesterData = MOCK_RESULTS.semesters.find(
    semester => semester.semesterNumber === selectedSemester
  );
  
  // Functions to get grade color
  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'success.main';
    if (grade.startsWith('B')) return 'info.main';
    if (grade.startsWith('C')) return 'warning.main';
    return 'error.main';
  };
  
  // Format semester title
  const formatSemesterTitle = (semester) => {
    return `Semester ${semester.semesterNumber} (${semester.term} ${semester.year})`;
  };
  
  // Calculate total credits and total points for a semester
  const calculateSemesterTotals = (semester) => {
    const totalCredits = semester.courses.reduce((sum, course) => sum + course.credits, 0);
    const totalPoints = semester.courses.reduce((sum, course) => sum + (course.credits * course.points), 0);
    return { totalCredits, totalPoints };
  };
  
  // Get grade description
  const getGradeDescription = (grade) => {
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
    if (MOCK_RESULTS.semesters.length < 2) return 'neutral';
    
    const lastTwoSemesters = MOCK_RESULTS.semesters.slice(-2);
    const diff = lastTwoSemesters[1].sgpa - lastTwoSemesters[0].sgpa;
    
    if (diff > 0.2) return 'up';
    if (diff < -0.2) return 'down';
    return 'neutral';
  };
  
  const semesterTrend = getSemesterTrend();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                {MOCK_RESULTS.currentCGPA.toFixed(2)}
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
                  {MOCK_RESULTS.overallProgress.completionPercentage.toFixed(1)}% Completed
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={MOCK_RESULTS.overallProgress.completionPercentage} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2">
                <strong>{MOCK_RESULTS.overallProgress.totalCreditsPassed}</strong> of <strong>{MOCK_RESULTS.overallProgress.totalCreditsRequired}</strong> credits completed
              </Typography>
              <Typography variant="body2">
                <strong>{MOCK_RESULTS.overallProgress.currentCredits}</strong> credits in progress
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
                  label={`${MOCK_RESULTS.gradeDistribution['A+']} A+ Grades`} 
                  color="success" 
                  size="small" 
                />
                <Chip 
                  icon={<StarIcon />} 
                  label={`${MOCK_RESULTS.gradeDistribution['A']} A Grades`} 
                  color="success" 
                  size="small" 
                />
                <Chip 
                  icon={<StarIcon />} 
                  label={`${MOCK_RESULTS.gradeDistribution['A-']} A- Grades`} 
                  color="success" 
                  size="small" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Tabs for Semester Results and Performance */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Semester Results" icon={<AssessmentIcon />} iconPosition="start" />
              <Tab label="Overall Performance" icon={<TimelineIcon />} iconPosition="start" />
            </Tabs>
            
            {selectedTab === 0 && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <FormControl sx={{ minWidth: 250 }}>
                    <InputLabel>Select Semester</InputLabel>
                    <Select
                      value={selectedSemester}
                      onChange={handleSemesterChange}
                      label="Select Semester"
                    >
                      {MOCK_RESULTS.semesters.map((semester) => (
                        <MenuItem key={semester.semesterNumber} value={semester.semesterNumber}>
                          {formatSemesterTitle(semester)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Box>
                    <IconButton color="primary" title="Print Results">
                      <PrintIcon />
                    </IconButton>
                    <IconButton color="primary" title="Download Results">
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                {currentSemesterData && (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6">
                        {formatSemesterTitle(currentSemesterData)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Chip 
                          label={`SGPA: ${currentSemesterData.sgpa.toFixed(2)}`} 
                          color="primary" 
                        />
                        <Chip 
                          label={`Status: ${currentSemesterData.status}`} 
                          color={currentSemesterData.status === 'Completed' ? 'success' : 'info'} 
                        />
                      </Box>
                    </Box>
                    
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Course Code</TableCell>
                            <TableCell>Course Name</TableCell>
                            <TableCell align="center">Credits</TableCell>
                            <TableCell align="center">Grade</TableCell>
                            <TableCell>Grade Points</TableCell>
                            <TableCell align="right">Credit Points</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {currentSemesterData.courses.map((course) => (
                            <TableRow key={course.code}>
                              <TableCell>{course.code}</TableCell>
                              <TableCell>{course.name}</TableCell>
                              <TableCell align="center">{course.credits}</TableCell>
                              <TableCell align="center">
                                <Chip 
                                  label={course.grade} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: getGradeColor(course.grade),
                                    color: 'white',
                                    fontWeight: 'bold',
                                  }} 
                                />
                              </TableCell>
                              <TableCell>{course.points} - {getGradeDescription(course.grade)}</TableCell>
                              <TableCell align="right">{course.credits * course.points}</TableCell>
                            </TableRow>
                          ))}
                          
                          {/* Summary row */}
                          <TableRow sx={{ '& td': { fontWeight: 'bold', bgcolor: 'rgba(0, 0, 0, 0.04)' } }}>
                            <TableCell colSpan={2}>Semester Totals</TableCell>
                            <TableCell align="center">{calculateSemesterTotals(currentSemesterData).totalCredits}</TableCell>
                            <TableCell align="center">SGPA: {currentSemesterData.sgpa.toFixed(2)}</TableCell>
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
                )}
              </>
            )}
            
            {selectedTab === 1 && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Cumulative Performance
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Below is a summary of your performance across all semesters.
                  </Typography>
                </Box>
                
                <TableContainer sx={{ mb: 4 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Semester</TableCell>
                        <TableCell align="center">Credits Attempted</TableCell>
                        <TableCell align="center">SGPA</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Cumulative GPA</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {MOCK_RESULTS.semesters.map((semester, index) => {
                        // Calculate running CGPA
                        const runningCGPA = MOCK_RESULTS.semesters
                          .slice(0, index + 1)
                          .reduce((total, sem, i, array) => {
                            const weight = calculateSemesterTotals(sem).totalCredits;
                            return total + (sem.sgpa * weight);
                          }, 0) / 
                          MOCK_RESULTS.semesters
                            .slice(0, index + 1)
                            .reduce((total, sem) => total + calculateSemesterTotals(sem).totalCredits, 0);
                            
                        return (
                          <TableRow key={semester.semesterNumber}>
                            <TableCell>{formatSemesterTitle(semester)}</TableCell>
                            <TableCell align="center">{calculateSemesterTotals(semester).totalCredits}</TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={semester.sgpa.toFixed(2)} 
                                size="small" 
                                color={
                                  semester.sgpa >= 9 ? 'success' : 
                                  semester.sgpa >= 8 ? 'primary' : 
                                  semester.sgpa >= 7 ? 'info' : 
                                  semester.sgpa >= 6 ? 'warning' : 'error'
                                } 
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={semester.status} 
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
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Grade Distribution
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Summary of grades earned across all completed courses.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {Object.entries(MOCK_RESULTS.gradeDistribution).map(([grade, count]) => (
                      <Grid item xs={6} sm={4} md={2} key={grade}>
                        <Card elevation={2} sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="h5" sx={{ color: getGradeColor(grade) }}>
                            {grade}
                          </Typography>
                          <Typography variant="h6">
                            {count}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            courses
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<DownloadIcon />}
                  >
                    Download Complete Transcript
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Results; 