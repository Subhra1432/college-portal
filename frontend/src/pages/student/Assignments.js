import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Alert,
  Badge,
  InputAdornment,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  AssignmentLate as AssignmentLateIcon,
  Close as CloseIcon,
  CalendarToday as CalendarTodayIcon,
  AttachFile as AttachFileIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckCircleIcon,
  Grade as GradeIcon,
} from '@mui/icons-material';

// Dummy assignments data
const DUMMY_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Data Structures Implementation',
    description: 'Implement a binary search tree with insertion, deletion, and traversal operations.',
    course: 'CS201 - Data Structures and Algorithms',
    dueDate: '2023-04-10T23:59:59',
    points: 100,
    status: 'due',
    attachments: ['Assignment_Guidelines.pdf'],
  },
  {
    id: 2,
    title: 'Database Normalization',
    description: 'Normalize the given database schema up to 3NF and explain your steps.',
    course: 'CS301 - Database Management Systems',
    dueDate: '2023-03-25T23:59:59',
    points: 75,
    status: 'submitted',
    submissionDate: '2023-03-23T14:30:00',
    submissionFiles: ['Normalization_Exercise.pdf'],
    feedback: null,
    grade: null,
  },
  {
    id: 3,
    title: 'Operating System Concepts',
    description: 'Write a report on process scheduling algorithms with comparisons and real-world applications.',
    course: 'CS303 - Operating Systems',
    dueDate: '2023-03-15T23:59:59',
    points: 50,
    status: 'graded',
    submissionDate: '2023-03-14T18:45:00',
    submissionFiles: ['Process_Scheduling_Report.pdf'],
    feedback: 'Excellent work! Good analysis of algorithms with practical examples.',
    grade: 47,
  },
  {
    id: 4,
    title: 'Digital Logic Circuit Design',
    description: 'Design a 4-bit counter using flip-flops and draw the circuit diagram.',
    course: 'CS202 - Digital Logic Design',
    dueDate: '2023-03-18T23:59:59',
    points: 60,
    status: 'overdue',
    attachments: ['Circuit_Design_Guidelines.pdf'],
  },
  {
    id: 5,
    title: 'Object-Oriented Programming Case Study',
    description: 'Implement a library management system using OOP principles with proper class hierarchies.',
    course: 'CS203 - Object-Oriented Programming',
    dueDate: '2023-04-05T23:59:59',
    points: 120,
    status: 'due',
    attachments: ['OOP_Case_Study_Requirements.pdf', 'Sample_UML_Diagram.png'],
  },
];

const Assignments = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAssignment, setOpenAssignment] = useState(null);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Calculate days remaining or overdue
  const getDaysRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'due':
        return 'primary';
      case 'submitted':
        return 'info';
      case 'graded':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'due':
        return <AssignmentIcon />;
      case 'submitted':
        return <AssignmentTurnedInIcon />;
      case 'graded':
        return <CheckCircleIcon />;
      case 'overdue':
        return <AssignmentLateIcon />;
      default:
        return <AssignmentIcon />;
    }
  };
  
  // Filter assignments based on tab and search
  const getFilteredAssignments = () => {
    return DUMMY_ASSIGNMENTS
      .filter(assignment => {
        // Filter by search query
        if (searchQuery) {
          return (
            assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.course.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Filter by tab
        if (activeTab === 0) return true; // All assignments
        if (activeTab === 1) return assignment.status === 'due'; // Pending
        if (activeTab === 2) return assignment.status === 'submitted'; // Submitted
        if (activeTab === 3) return assignment.status === 'graded'; // Graded
        if (activeTab === 4) return assignment.status === 'overdue'; // Overdue
        
        return true;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort by due date
  };
  
  // Handle assignment click
  const handleAssignmentClick = (assignment) => {
    setOpenAssignment(assignment);
  };
  
  // Handle assignment dialog close
  const handleAssignmentClose = () => {
    setOpenAssignment(null);
  };
  
  // Handle submit button click
  const handleSubmitClick = () => {
    setOpenSubmitDialog(true);
  };
  
  // Handle submit dialog close
  const handleSubmitDialogClose = () => {
    setOpenSubmitDialog(false);
    setUploadFiles([]);
    setSubmitSuccess(false);
  };
  
  // Handle file selection
  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files);
    setUploadFiles(files);
  };
  
  // Handle assignment submission
  const handleSubmitAssignment = () => {
    if (uploadFiles.length === 0) return;
    
    setSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
    }, 2000);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Assignments
          </Typography>
        </Grid>
        
        {/* Search and Filter */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="All" />
                <Tab 
                  label={
                    <Badge 
                      badgeContent={DUMMY_ASSIGNMENTS.filter(a => a.status === 'due').length} 
                      color="primary"
                    >
                      Pending
                    </Badge>
                  } 
                />
                <Tab 
                  label={
                    <Badge 
                      badgeContent={DUMMY_ASSIGNMENTS.filter(a => a.status === 'submitted').length} 
                      color="info"
                    >
                      Submitted
                    </Badge>
                  } 
                />
                <Tab 
                  label={
                    <Badge 
                      badgeContent={DUMMY_ASSIGNMENTS.filter(a => a.status === 'graded').length} 
                      color="success"
                    >
                      Graded
                    </Badge>
                  } 
                />
                <Tab 
                  label={
                    <Badge 
                      badgeContent={DUMMY_ASSIGNMENTS.filter(a => a.status === 'overdue').length} 
                      color="error"
                    >
                      Overdue
                    </Badge>
                  } 
                />
              </Tabs>
            </Box>
          </Paper>
        </Grid>
        
        {/* Assignment Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {getFilteredAssignments().length === 0 ? (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="textSecondary">No assignments found</Typography>
                </Paper>
              </Grid>
            ) : (
              getFilteredAssignments().map(assignment => (
                <Grid item xs={12} sm={6} md={4} key={assignment.id}>
                  <Card 
                    elevation={3} 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderTop: `4px solid ${
                        assignment.status === 'due' ? '#2196f3' :
                        assignment.status === 'submitted' ? '#03a9f4' :
                        assignment.status === 'graded' ? '#4caf50' :
                        '#f44336'
                      }`,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" gutterBottom noWrap sx={{ maxWidth: '80%' }}>
                          {assignment.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={assignment.status === 'due' ? 'Due' : 
                                assignment.status === 'submitted' ? 'Submitted' :
                                assignment.status === 'graded' ? 'Graded' : 'Overdue'}
                          color={getStatusColor(assignment.status)}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {assignment.course}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ 
                        mb: 2, 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        height: '40px',
                      }}>
                        {assignment.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ScheduleIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          Due: {formatDate(assignment.dueDate)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachFileIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {assignment.attachments ? 
                            `${assignment.attachments.length} attachment${assignment.attachments.length !== 1 ? 's' : ''}` : 
                            'No attachments'}
                        </Typography>
                      </Box>
                      
                      {assignment.status === 'due' && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color={getDaysRemaining(assignment.dueDate) <= 1 ? 'error' : 'textSecondary'}>
                            {getDaysRemaining(assignment.dueDate) > 0 
                              ? `${getDaysRemaining(assignment.dueDate)} day${getDaysRemaining(assignment.dueDate) !== 1 ? 's' : ''} remaining` 
                              : 'Due today!'}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.max(0, Math.min(100, (getDaysRemaining(assignment.dueDate) / 14) * 100))} 
                            color={getDaysRemaining(assignment.dueDate) <= 1 ? 'error' : 'primary'}
                            sx={{ mt: 1, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      )}
                      
                      {assignment.status === 'graded' && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            Grade:
                          </Typography>
                          <Chip
                            label={`${assignment.grade}/${assignment.points}`}
                            color={assignment.grade / assignment.points >= 0.7 ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => handleAssignmentClick(assignment)}
                      >
                        View Details
                      </Button>
                      {assignment.status === 'due' && (
                        <Button
                          size="small"
                          color="primary"
                          onClick={handleSubmitClick}
                        >
                          Submit
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
      
      {/* Assignment Detail Dialog */}
      <Dialog
        open={!!openAssignment}
        onClose={handleAssignmentClose}
        maxWidth="md"
        fullWidth
      >
        {openAssignment && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              {openAssignment.title}
              <IconButton
                aria-label="close"
                onClick={handleAssignmentClose}
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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CategoryIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        Course:
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ ml: 4 }}>
                      {openAssignment.course}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ScheduleIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        Due Date:
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ ml: 4 }}>
                      {formatDate(openAssignment.dueDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        Status:
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 4 }}>
                      <Chip
                        icon={getStatusIcon(openAssignment.status)}
                        label={openAssignment.status === 'due' ? 'Due' : 
                              openAssignment.status === 'submitted' ? 'Submitted' :
                              openAssignment.status === 'graded' ? 'Graded' : 'Overdue'}
                        color={getStatusColor(openAssignment.status)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GradeIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="textSecondary">
                        Points:
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ ml: 4 }}>
                      {openAssignment.status === 'graded' 
                        ? `${openAssignment.grade}/${openAssignment.points}` 
                        : `${openAssignment.points} points`}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {openAssignment.description}
              </Typography>
              
              {openAssignment.attachments && openAssignment.attachments.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Attachments
                  </Typography>
                  <List>
                    {openAssignment.attachments.map((attachment, index) => (
                      <ListItem button key={`attachment-${index}`}>
                        <ListItemIcon>
                          {attachment.endsWith('.pdf') ? <PdfIcon /> : <FileIcon />}
                        </ListItemIcon>
                        <ListItemText primary={attachment} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              {openAssignment.status === 'submitted' && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Your Submission
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Submitted on: {formatDate(openAssignment.submissionDate)}
                    </Typography>
                  </Box>
                  <List>
                    {openAssignment.submissionFiles.map((file, index) => (
                      <ListItem button key={`submission-${index}`}>
                        <ListItemIcon>
                          {file.endsWith('.pdf') ? <PdfIcon /> : <FileIcon />}
                        </ListItemIcon>
                        <ListItemText primary={file} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              {openAssignment.status === 'graded' && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Feedback
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {openAssignment.feedback || 'No feedback provided.'}
                  </Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              {openAssignment.status === 'due' && (
                <Button
                  onClick={handleSubmitClick}
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                >
                  Submit Assignment
                </Button>
              )}
              <Button onClick={handleAssignmentClose}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Submit Assignment Dialog */}
      <Dialog
        open={openSubmitDialog}
        onClose={handleSubmitDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Submit Assignment
          <IconButton
            aria-label="close"
            onClick={handleSubmitDialogClose}
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
          {submitSuccess ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Assignment Submitted Successfully!
              </Typography>
              <Typography variant="body1" paragraph>
                Your assignment has been submitted. You can check the status in your submissions.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" paragraph>
                Upload your completed assignment files. Accepted formats: .pdf, .doc, .docx, .zip
              </Typography>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<AttachFileIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Select Files
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileSelection}
                />
              </Button>
              
              {uploadFiles.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Files:
                  </Typography>
                  <List>
                    {uploadFiles.map((file, index) => (
                      <ListItem key={`upload-${index}`}>
                        <ListItemIcon>
                          {file.name.endsWith('.pdf') ? <PdfIcon /> : <FileIcon />}
                        </ListItemIcon>
                        <ListItemText 
                          primary={file.name}
                          secondary={`${(file.size / 1024).toFixed(2)} KB`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              <TextField
                label="Comments (Optional)"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                margin="normal"
              />
              
              {submitting && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress />
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {submitSuccess ? (
            <Button onClick={handleSubmitDialogClose} variant="contained" color="primary">
              Done
            </Button>
          ) : (
            <>
              <Button onClick={handleSubmitDialogClose}>Cancel</Button>
              <Button
                onClick={handleSubmitAssignment}
                variant="contained"
                color="primary"
                disabled={uploadFiles.length === 0 || submitting}
                startIcon={<CloudUploadIcon />}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Assignments; 