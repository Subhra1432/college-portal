import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
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
  TextField,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  School as SchoolIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Book as BookIcon,
  Grade as GradeIcon,
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
  { id: 1, name: 'John Smith', regNo: 'CS2021001', marks: '', grade: '' },
  { id: 2, name: 'Emily Johnson', regNo: 'CS2021002', marks: '', grade: '' },
  { id: 3, name: 'Michael Brown', regNo: 'CS2021003', marks: '', grade: '' },
  { id: 4, name: 'Jessica Davis', regNo: 'CS2021004', marks: '', grade: '' },
  { id: 5, name: 'James Wilson', regNo: 'CS2021005', marks: '', grade: '' },
  { id: 6, name: 'Emma Martinez', regNo: 'CS2021006', marks: '', grade: '' },
  { id: 7, name: 'William Taylor', regNo: 'CS2021007', marks: '', grade: '' },
  { id: 8, name: 'Olivia Thomas', regNo: 'CS2021008', marks: '', grade: '' },
  { id: 9, name: 'Benjamin Anderson', regNo: 'CS2021009', marks: '', grade: '' },
  { id: 10, name: 'Sophia Jackson', regNo: 'CS2021010', marks: '', grade: '' },
];

// Grade mapping
const GRADE_MAPPING = [
  { range: [90, 100], grade: 'A' },
  { range: [80, 89], grade: 'B' },
  { range: [70, 79], grade: 'C' },
  { range: [60, 69], grade: 'D' },
  { range: [0, 59], grade: 'F' },
];

const UploadMarks = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);
  const [studentsData, setStudentsData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Handle course selection
  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);
    
    if (courseId) {
      // In a real app, you would fetch students for this course
      // For this demo, we'll use the dummy data
      const initialData = DUMMY_STUDENTS.map(student => ({
        ...student,
        marks: '',
        grade: '',
      }));
      
      setStudentsData(initialData);
    } else {
      setStudentsData([]);
    }
  };
  
  // Handle exam type selection
  const handleExamTypeChange = (event) => {
    setSelectedExamType(event.target.value);
  };
  
  // Handle total marks change
  const handleTotalMarksChange = (event) => {
    const value = event.target.value;
    if (value > 0) {
      setTotalMarks(value);
    }
  };
  
  // Handle marks input for a student
  const handleMarksChange = (studentId, value) => {
    if (value === '' || (value >= 0 && value <= totalMarks)) {
      const updatedData = studentsData.map(student => {
        if (student.id === studentId) {
          const marks = value === '' ? '' : Number(value);
          const grade = calculateGrade(marks, totalMarks);
          return { ...student, marks, grade };
        }
        return student;
      });
      
      setStudentsData(updatedData);
    }
  };
  
  // Calculate grade based on marks and total marks
  const calculateGrade = (marks, total) => {
    if (marks === '') return '';
    
    const percentage = (marks / total) * 100;
    
    for (const { range, grade } of GRADE_MAPPING) {
      if (percentage >= range[0] && percentage <= range[1]) {
        return grade;
      }
    }
    
    return '';
  };
  
  // Handle save marks
  const handleSaveMarks = () => {
    // Validate that all students have marks entered
    const allMarksEntered = studentsData.every(student => student.marks !== '');
    
    if (!allMarksEntered) {
      setNotification({
        open: true,
        message: 'Please enter marks for all students before saving.',
        severity: 'error',
      });
      return;
    }
    
    // In a real app, you would send this data to the backend
    setIsUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      setNotification({
        open: true,
        message: 'Marks saved successfully!',
        severity: 'success',
      });
    }, 1500);
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Get the selected course details
  const getCourseDetails = () => {
    return DUMMY_COURSES.find(course => course.id === selectedCourse);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Marks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter and manage student marks for exams and assessments
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Selection Controls */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
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
            
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="exam-type-label">Exam Type</InputLabel>
              <Select
                labelId="exam-type-label"
                id="exam-type"
                value={selectedExamType}
                onChange={handleExamTypeChange}
                label="Exam Type"
                disabled={!selectedCourse}
              >
                <MenuItem value="">
                  <em>Select exam type</em>
                </MenuItem>
                <MenuItem value="midterm">Midterm Examination</MenuItem>
                <MenuItem value="final">Final Examination</MenuItem>
                <MenuItem value="quiz">Quiz</MenuItem>
                <MenuItem value="assignment">Assignment</MenuItem>
                <MenuItem value="project">Project</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Total Marks"
                type="number"
                value={totalMarks}
                onChange={handleTotalMarksChange}
                disabled={!selectedCourse || !selectedExamType}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </FormControl>
          </Paper>
        </Grid>
        
        {/* Course Info */}
        <Grid item xs={12} md={8}>
          {selectedCourse ? (
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BookIcon color="primary" sx={{ mr: 1.5, fontSize: 30 }} />
                <Typography variant="h5">
                  {getCourseDetails()?.code}: {getCourseDetails()?.name}
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      Semester: {getCourseDetails()?.semester}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <GradeIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {selectedExamType ? (
                        `Exam: ${selectedExamType.charAt(0).toUpperCase() + selectedExamType.slice(1)}`
                      ) : (
                        'No exam type selected'
                      )}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Select a course to upload marks
              </Typography>
            </Paper>
          )}
        </Grid>
        
        {/* Marks Table */}
        {selectedCourse && selectedExamType && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Enter Marks
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  onClick={handleSaveMarks}
                  disabled={isUploading || !studentsData.length}
                >
                  {isUploading ? 'Saving...' : 'Save Marks'}
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width="5%">#</TableCell>
                      <TableCell width="15%">Reg No</TableCell>
                      <TableCell width="25%">Student Name</TableCell>
                      <TableCell width="25%">Marks (out of {totalMarks})</TableCell>
                      <TableCell width="15%">Grade</TableCell>
                      <TableCell width="15%">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentsData.map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{student.regNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={student.marks}
                            onChange={(e) => handleMarksChange(student.id, e.target.value)}
                            InputProps={{ inputProps: { min: 0, max: totalMarks } }}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          {student.grade && (
                            <Chip 
                              label={student.grade} 
                              color={
                                student.grade === 'A' ? 'success' :
                                student.grade === 'B' ? 'primary' :
                                student.grade === 'C' ? 'info' :
                                student.grade === 'D' ? 'warning' : 'error'
                              }
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {student.marks === '' ? (
                            <Chip label="Pending" variant="outlined" size="small" />
                          ) : (
                            <Chip label="Entered" color="success" size="small" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UploadMarks; 