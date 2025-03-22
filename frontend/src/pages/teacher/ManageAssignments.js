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
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  AttachFile as AttachFileIcon,
  School as SchoolIcon,
  Check as CheckIcon,
  Save as SaveIcon,
  Grade as GradeIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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

// Dummy assignments data
const DUMMY_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Binary Trees Implementation',
    description: 'Implement a binary search tree with insertion, deletion, and traversal operations.',
    courseId: 1,
    dueDate: '2023-04-15',
    totalMarks: 100,
    status: 'active',
    attachments: ['Assignment_Guidelines.pdf'],
    submissions: 15,
  },
  {
    id: 2,
    title: 'Database Normalization',
    description: 'Normalize the given database schema up to 3NF and explain your steps.',
    courseId: 2,
    dueDate: '2023-03-25',
    totalMarks: 75,
    status: 'active',
    attachments: ['DB_Schema.pdf'],
    submissions: 22,
  },
  {
    id: 3,
    title: 'Operating System Concepts',
    description: 'Write a report on process scheduling algorithms with comparisons and real-world applications.',
    courseId: 3,
    dueDate: '2023-03-15',
    totalMarks: 50,
    status: 'past',
    attachments: ['OS_Concepts_Guidelines.pdf'],
    submissions: 40,
  }
];

// Dummy submissions data
const DUMMY_SUBMISSIONS = [
  {
    id: 1,
    assignmentId: 1,
    studentId: 1,
    studentName: 'John Smith',
    regNo: 'CS2021001',
    submissionDate: '2023-04-10T14:30:00',
    files: ['BST_Implementation.zip'],
    status: 'submitted',
    marks: null,
    feedback: '',
  },
  {
    id: 2,
    assignmentId: 1,
    studentId: 2,
    studentName: 'Emily Johnson',
    regNo: 'CS2021002',
    submissionDate: '2023-04-09T18:45:00',
    files: ['BST_Emily.zip'],
    status: 'graded',
    marks: 85,
    feedback: 'Good implementation, but could improve time complexity in the deletion operation.',
  },
  {
    id: 3,
    assignmentId: 1,
    studentId: 3,
    studentName: 'Michael Brown',
    regNo: 'CS2021003',
    submissionDate: '2023-04-11T09:15:00',
    files: ['Michael_BST.zip'],
    status: 'submitted',
    marks: null,
    feedback: '',
  }
];

const ManageAssignments = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createDialogLoading, setCreateDialogLoading] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    totalMarks: 100,
    file: null,
  });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [gradeData, setGradeData] = useState({
    marks: '',
    feedback: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle course selection
  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);
    
    if (courseId) {
      // In a real app, you'd fetch assignments for this course
      // For this demo, we'll filter the dummy data
      const filteredAssignments = DUMMY_ASSIGNMENTS.filter(
        assignment => assignment.courseId === courseId
      );
      setAssignments(filteredAssignments);
    } else {
      setAssignments([]);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Handle create assignment dialog
  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };
  
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setNewAssignment({
      title: '',
      description: '',
      dueDate: new Date(),
      totalMarks: 100,
      file: null,
    });
  };
  
  // Handle new assignment form changes
  const handleNewAssignmentChange = (field, value) => {
    setNewAssignment(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Handle file selection
  const handleFileSelect = (event) => {
    setNewAssignment(prev => ({
      ...prev,
      file: event.target.files[0],
    }));
  };
  
  // Handle create assignment submission
  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.description) {
      setNotification({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }
    
    setCreateDialogLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd send the assignment data to the backend
      // and get back the created assignment with an ID
      
      // For this demo, we'll just add it to our local state
      const newId = Math.max(...assignments.map(a => a.id), 0) + 1;
      const newAssignmentObj = {
        id: newId,
        title: newAssignment.title,
        description: newAssignment.description,
        courseId: selectedCourse,
        dueDate: newAssignment.dueDate.toISOString().split('T')[0],
        totalMarks: newAssignment.totalMarks,
        status: 'active',
        attachments: newAssignment.file ? [newAssignment.file.name] : [],
        submissions: 0,
      };
      
      setAssignments(prev => [...prev, newAssignmentObj]);
      setCreateDialogLoading(false);
      handleCloseCreateDialog();
      
      setNotification({
        open: true,
        message: 'Assignment created successfully',
        severity: 'success',
      });
    }, 1500);
  };
  
  // Handle view submissions
  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    
    // In a real app, you'd fetch submissions for this assignment
    // For this demo, we'll filter the dummy data
    const filteredSubmissions = DUMMY_SUBMISSIONS.filter(
      submission => submission.assignmentId === assignment.id
    );
    
    setSubmissions(filteredSubmissions);
    setOpenSubmissionsDialog(true);
  };
  
  // Handle close submissions dialog
  const handleCloseSubmissionsDialog = () => {
    setOpenSubmissionsDialog(false);
    setSelectedAssignment(null);
    setSubmissions([]);
  };
  
  // Handle open grade dialog
  const handleOpenGradeDialog = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      marks: submission.marks !== null ? submission.marks : '',
      feedback: submission.feedback || '',
    });
    setOpenGradeDialog(true);
  };
  
  // Handle close grade dialog
  const handleCloseGradeDialog = () => {
    setOpenGradeDialog(false);
    setSelectedSubmission(null);
    setGradeData({
      marks: '',
      feedback: '',
    });
  };
  
  // Handle grade data change
  const handleGradeDataChange = (field, value) => {
    setGradeData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Handle save grade
  const handleSaveGrade = () => {
    if (gradeData.marks === '') {
      setNotification({
        open: true,
        message: 'Please enter marks',
        severity: 'error',
      });
      return;
    }
    
    // In a real app, you'd send the grade data to the backend
    // For this demo, we'll update our local state
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === selectedSubmission.id
          ? {
              ...sub,
              marks: Number(gradeData.marks),
              feedback: gradeData.feedback,
              status: 'graded',
            }
          : sub
      )
    );
    
    setNotification({
      open: true,
      message: 'Submission graded successfully',
      severity: 'success',
    });
    
    handleCloseGradeDialog();
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };
  
  // Get course details
  const getCourseDetails = () => {
    return DUMMY_COURSES.find(course => course.id === selectedCourse);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Manage Assignments
          </Typography>
          
          {selectedCourse && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateDialog}
            >
              Create Assignment
            </Button>
          )}
        </Grid>
        
        {/* Course Selection */}
        <Grid item xs={12}>
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
        
        {selectedCourse && (
          <>
            {/* Course Info */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SchoolIcon color="primary" sx={{ mr: 1.5, fontSize: 30 }} />
                  <Typography variant="h5">
                    {getCourseDetails()?.code}: {getCourseDetails()?.name}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                  {getCourseDetails()?.semester} • {getCourseDetails()?.students} Students
                </Typography>
              </Paper>
            </Grid>
            
            {/* Assignments Tabs */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="Active Assignments" />
                  <Tab label="Past Assignments" />
                </Tabs>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Active Assignments */}
                {activeTab === 0 && (
                  <>
                    {assignments.filter(a => a.status === 'active').length > 0 ? (
                      <Grid container spacing={2}>
                        {assignments
                          .filter(a => a.status === 'active')
                          .map(assignment => (
                            <Grid item xs={12} md={6} key={assignment.id}>
                              <Card elevation={3}>
                                <CardContent>
                                  <Typography variant="h6" gutterBottom>
                                    {assignment.title}
                                  </Typography>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AssignmentIcon color="action" sx={{ mr: 1, fontSize: 'small' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      Due: {formatDate(assignment.dueDate)}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <GradeIcon color="action" sx={{ mr: 1, fontSize: 'small' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      Marks: {assignment.totalMarks}
                                    </Typography>
                                  </Box>
                                  
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Submissions: {assignment.submissions} / {getCourseDetails()?.students}
                                  </Typography>
                                  
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      mb: 2,
                                      display: '-webkit-box',
                                      WebkitLineClamp: 3,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      height: '4.5em',
                                    }}
                                  >
                                    {assignment.description}
                                  </Typography>
                                  
                                  {assignment.attachments.length > 0 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <AttachFileIcon color="action" sx={{ mr: 1, fontSize: 'small' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {assignment.attachments.length} attachment{assignment.attachments.length !== 1 ? 's' : ''}
                                      </Typography>
                                    </Box>
                                  )}
                                </CardContent>
                                <CardActions>
                                  <Button
                                    size="small"
                                    startIcon={<EditIcon />}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="small"
                                    startIcon={<AssignmentTurnedInIcon />}
                                    onClick={() => handleViewSubmissions(assignment)}
                                  >
                                    View Submissions
                                  </Button>
                                </CardActions>
                              </Card>
                            </Grid>
                          ))}
                      </Grid>
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          No active assignments found
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={handleOpenCreateDialog}
                          sx={{ mt: 2 }}
                        >
                          Create Assignment
                        </Button>
                      </Box>
                    )}
                  </>
                )}
                
                {/* Past Assignments */}
                {activeTab === 1 && (
                  <>
                    {assignments.filter(a => a.status === 'past').length > 0 ? (
                      <Grid container spacing={2}>
                        {assignments
                          .filter(a => a.status === 'past')
                          .map(assignment => (
                            <Grid item xs={12} md={6} key={assignment.id}>
                              <Card elevation={3}>
                                <CardContent>
                                  <Typography variant="h6" gutterBottom>
                                    {assignment.title}
                                  </Typography>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AssignmentIcon color="action" sx={{ mr: 1, fontSize: 'small' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      Due: {formatDate(assignment.dueDate)}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <GradeIcon color="action" sx={{ mr: 1, fontSize: 'small' }} />
                                    <Typography variant="body2" color="text.secondary">
                                      Marks: {assignment.totalMarks}
                                    </Typography>
                                  </Box>
                                  
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Submissions: {assignment.submissions} / {getCourseDetails()?.students}
                                  </Typography>
                                  
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      mb: 2,
                                      display: '-webkit-box',
                                      WebkitLineClamp: 3,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      height: '4.5em',
                                    }}
                                  >
                                    {assignment.description}
                                  </Typography>
                                </CardContent>
                                <CardActions>
                                  <Button
                                    size="small"
                                    startIcon={<AssignmentTurnedInIcon />}
                                    onClick={() => handleViewSubmissions(assignment)}
                                  >
                                    View Submissions
                                  </Button>
                                </CardActions>
                              </Card>
                            </Grid>
                          ))}
                      </Grid>
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          No past assignments found
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
      
      {/* Create Assignment Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Create New Assignment
          <IconButton
            aria-label="close"
            onClick={handleCloseCreateDialog}
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Assignment Title"
                value={newAssignment.title}
                onChange={(e) => handleNewAssignmentChange('title', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={newAssignment.dueDate}
                  onChange={(date) => handleNewAssignmentChange('dueDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Total Marks"
                type="number"
                value={newAssignment.totalMarks}
                onChange={(e) => handleNewAssignmentChange('totalMarks', e.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={newAssignment.description}
                onChange={(e) => handleNewAssignmentChange('description', e.target.value)}
                multiline
                rows={4}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Upload Assignment File
                <input
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                />
              </Button>
              
              {newAssignment.file && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <PdfIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {newAssignment.file.name}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateAssignment}
            disabled={createDialogLoading}
            startIcon={createDialogLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          >
            {createDialogLoading ? 'Creating...' : 'Create Assignment'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Submissions Dialog */}
      <Dialog
        open={openSubmissionsDialog}
        onClose={handleCloseSubmissionsDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedAssignment && (
          <>
            <DialogTitle>
              Submissions for {selectedAssignment.title}
              <IconButton
                aria-label="close"
                onClick={handleCloseSubmissionsDialog}
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
                <Typography variant="subtitle1" gutterBottom>
                  Assignment Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Due Date: {formatDate(selectedAssignment.dueDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Marks: {selectedAssignment.totalMarks}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Submissions: {submissions.length} / {getCourseDetails()?.students}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Student Submissions
              </Typography>
              
              {submissions.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Reg No</TableCell>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Submission Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Marks</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>{submission.regNo}</TableCell>
                          <TableCell>{submission.studentName}</TableCell>
                          <TableCell>{new Date(submission.submissionDate).toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={submission.status === 'graded' ? 'Graded' : 'Submitted'}
                              color={submission.status === 'graded' ? 'success' : 'primary'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {submission.status === 'graded' ? (
                              `${submission.marks}/${selectedAssignment.totalMarks}`
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleOpenGradeDialog(submission)}
                            >
                              {submission.status === 'graded' ? 'Edit Grade' : 'Grade'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No submissions yet
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSubmissionsDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Grade Submission Dialog */}
      <Dialog
        open={openGradeDialog}
        onClose={handleCloseGradeDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedSubmission && selectedAssignment && (
          <>
            <DialogTitle>
              Grade Submission
              <IconButton
                aria-label="close"
                onClick={handleCloseGradeDialog}
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
                <Typography variant="subtitle1" gutterBottom>
                  Student Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Name: {selectedSubmission.studentName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Reg No: {selectedSubmission.regNo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Submitted on: {new Date(selectedSubmission.submissionDate).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Submitted Files
              </Typography>
              
              <List>
                {selectedSubmission.files.map((file, index) => (
                  <ListItem key={index} button>
                    <ListItemIcon>
                      {file.endsWith('.pdf') ? <PdfIcon /> : <DescriptionIcon />}
                    </ListItemIcon>
                    <ListItemText primary={file} />
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Grading
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label={`Marks (out of ${selectedAssignment.totalMarks})`}
                    type="number"
                    value={gradeData.marks}
                    onChange={(e) => handleGradeDataChange('marks', e.target.value)}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 0, max: selectedAssignment.totalMarks } }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Feedback"
                    value={gradeData.feedback}
                    onChange={(e) => handleGradeDataChange('feedback', e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseGradeDialog}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSaveGrade}
                startIcon={<SaveIcon />}
              >
                Save Grade
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
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

export default ManageAssignments; 