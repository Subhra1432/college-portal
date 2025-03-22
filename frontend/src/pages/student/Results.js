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
  Divider,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

// Dummy results data
const DUMMY_SEMESTERS = [
  {
    id: 1,
    name: 'Semester 1',
    year: '2021-2022',
    term: 'Fall',
    gpa: 3.8,
    results: [
      { subjectCode: 'CS101', subjectName: 'Introduction to Computer Science', credits: 4, grade: 'A', points: 16 },
      { subjectCode: 'MA101', subjectName: 'Engineering Mathematics', credits: 4, grade: 'A-', points: 14.8 },
      { subjectCode: 'PH101', subjectName: 'Engineering Physics', credits: 3, grade: 'B+', points: 9.9 },
      { subjectCode: 'EN101', subjectName: 'Technical English', credits: 2, grade: 'A', points: 8 },
      { subjectCode: 'CS102', subjectName: 'Programming Fundamentals', credits: 4, grade: 'A', points: 16 },
    ],
  },
  {
    id: 2,
    name: 'Semester 2',
    year: '2021-2022',
    term: 'Spring',
    gpa: 3.7,
    results: [
      { subjectCode: 'CS201', subjectName: 'Data Structures and Algorithms', credits: 4, grade: 'A-', points: 14.8 },
      { subjectCode: 'MA201', subjectName: 'Advanced Mathematics', credits: 4, grade: 'B+', points: 13.2 },
      { subjectCode: 'CS202', subjectName: 'Digital Logic Design', credits: 4, grade: 'A', points: 16 },
      { subjectCode: 'CS203', subjectName: 'Object-Oriented Programming', credits: 4, grade: 'A', points: 16 },
      { subjectCode: 'HU201', subjectName: 'Economics for Engineers', credits: 2, grade: 'B', points: 6 },
    ],
  },
  {
    id: 3,
    name: 'Semester 3',
    year: '2022-2023',
    term: 'Fall',
    gpa: 3.9,
    results: [
      { subjectCode: 'CS301', subjectName: 'Database Management Systems', credits: 4, grade: 'A', points: 16 },
      { subjectCode: 'CS302', subjectName: 'Computer Organization', credits: 4, grade: 'A', points: 16 },
      { subjectCode: 'CS303', subjectName: 'Operating Systems', credits: 4, grade: 'A-', points: 14.8 },
      { subjectCode: 'CS304', subjectName: 'Design and Analysis of Algorithms', credits: 4, grade: 'A', points: 16 },
      { subjectCode: 'HU301', subjectName: 'Professional Ethics', credits: 2, grade: 'A', points: 8 },
    ],
  },
];

const Results = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedSemester, setSelectedSemester] = useState(DUMMY_SEMESTERS[0].id);
  
  // Get selected semester data
  const getSemesterData = () => {
    return DUMMY_SEMESTERS.find(semester => semester.id === selectedSemester);
  };
  
  // Calculate total credits for the semester
  const calculateTotalCredits = (semesterData) => {
    return semesterData.results.reduce((total, subject) => total + subject.credits, 0);
  };
  
  // Format GPA
  const formatGPA = (gpa) => {
    return gpa.toFixed(2);
  };
  
  // Calculate cumulative GPA
  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    DUMMY_SEMESTERS.forEach(semester => {
      semester.results.forEach(subject => {
        totalPoints += subject.points;
        totalCredits += subject.credits;
      });
    });
    
    return totalPoints / totalCredits;
  };
  
  // Get color based on grade
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
      case 'A+':
        return 'success';
      case 'A-':
      case 'B+':
      case 'B':
        return 'primary';
      case 'B-':
      case 'C+':
      case 'C':
        return 'warning';
      default:
        return 'error';
    }
  };
  
  // Get numeric value of grade
  const getGradeValue = (grade) => {
    switch (grade) {
      case 'A+': return 4.0;
      case 'A': return 4.0;
      case 'A-': return 3.7;
      case 'B+': return 3.3;
      case 'B': return 3.0;
      case 'B-': return 2.7;
      case 'C+': return 2.3;
      case 'C': return 2.0;
      case 'C-': return 1.7;
      case 'D+': return 1.3;
      case 'D': return 1.0;
      case 'F': return 0.0;
      default: return 0.0;
    }
  };
  
  const cgpa = calculateCGPA();
  const semesterData = getSemesterData();
  const totalCredits = calculateTotalCredits(semesterData);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Academic Results
          </Typography>
        </Grid>
        
        {/* GPA Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GradeIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6">
                      Cumulative GPA
                    </Typography>
                  </Box>
                  <Typography variant="h3" color="primary" align="center">
                    {formatGPA(cgpa)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(cgpa / 4) * 100} 
                        color="primary"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((cgpa / 4) * 100)}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6">
                      Current Standing
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Chip 
                      label={cgpa >= 3.7 ? "Distinction" : cgpa >= 3.0 ? "First Class" : cgpa >= 2.0 ? "Second Class" : "Needs Improvement"}
                      color={cgpa >= 3.7 ? "success" : cgpa >= 3.0 ? "primary" : cgpa >= 2.0 ? "warning" : "error"}
                      sx={{ fontSize: '1.2rem', py: 2, px: 3 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Based on your cumulative GPA
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6">
                      Total Credits
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="primary">
                      {DUMMY_SEMESTERS.reduce((total, semester) => 
                        total + calculateTotalCredits(semester), 0
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Credits completed across all semesters
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Semester Results */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Semester Results
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Select Semester</InputLabel>
                  <Select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    label="Select Semester"
                  >
                    {DUMMY_SEMESTERS.map(semester => (
                      <MenuItem key={semester.id} value={semester.id}>
                        {semester.name} ({semester.year}, {semester.term})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  size="small"
                >
                  Download
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  size="small"
                >
                  Print
                </Button>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Semester
                  </Typography>
                  <Typography variant="body1">
                    {semesterData.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Academic Year
                  </Typography>
                  <Typography variant="body1">
                    {semesterData.year}, {semesterData.term}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    GPA
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatGPA(semesterData.gpa)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Credits
                  </Typography>
                  <Typography variant="body1">
                    {totalCredits}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2">Subject Code</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2">Subject Name</Typography></TableCell>
                    <TableCell align="center"><Typography variant="subtitle2">Credits</Typography></TableCell>
                    <TableCell align="center"><Typography variant="subtitle2">Grade</Typography></TableCell>
                    <TableCell align="center"><Typography variant="subtitle2">Grade Points</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {semesterData.results.map((subject) => (
                    <TableRow key={subject.subjectCode}>
                      <TableCell>{subject.subjectCode}</TableCell>
                      <TableCell>{subject.subjectName}</TableCell>
                      <TableCell align="center">{subject.credits}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={subject.grade}
                          color={getGradeColor(subject.grade)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">{subject.points}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} align="right">
                      <Typography variant="subtitle2">Total</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2">{totalCredits}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2">GPA</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2">{formatGPA(semesterData.gpa)}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Grade Distribution */}
        <Grid item xs={12}>
          <Accordion elevation={3}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="grade-distribution-content"
              id="grade-distribution-header"
            >
              <Typography variant="h6">Grading System</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography variant="subtitle2">Letter Grade</Typography></TableCell>
                      <TableCell align="center"><Typography variant="subtitle2">Grade Point</Typography></TableCell>
                      <TableCell><Typography variant="subtitle2">Description</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>A+</TableCell>
                      <TableCell align="center">4.0</TableCell>
                      <TableCell>Outstanding</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>A</TableCell>
                      <TableCell align="center">4.0</TableCell>
                      <TableCell>Excellent</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>A-</TableCell>
                      <TableCell align="center">3.7</TableCell>
                      <TableCell>Very Good</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>B+</TableCell>
                      <TableCell align="center">3.3</TableCell>
                      <TableCell>Good</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>B</TableCell>
                      <TableCell align="center">3.0</TableCell>
                      <TableCell>Above Average</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>B-</TableCell>
                      <TableCell align="center">2.7</TableCell>
                      <TableCell>Average</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>C+</TableCell>
                      <TableCell align="center">2.3</TableCell>
                      <TableCell>Below Average</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>C</TableCell>
                      <TableCell align="center">2.0</TableCell>
                      <TableCell>Satisfactory</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>C-</TableCell>
                      <TableCell align="center">1.7</TableCell>
                      <TableCell>Passing</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>D</TableCell>
                      <TableCell align="center">1.0</TableCell>
                      <TableCell>Poor</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>F</TableCell>
                      <TableCell align="center">0.0</TableCell>
                      <TableCell>Failure</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Results; 