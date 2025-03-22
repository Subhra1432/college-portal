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
  TextField,
  Button,
  IconButton,
  Chip,
  Avatar,
  Divider,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

// Mock student data
const MOCK_STUDENTS = [
  {
    id: 1,
    name: 'John Smith',
    registrationNumber: 'CS2023001',
    email: 'john.smith@example.com',
    program: 'B.Tech',
    department: 'Computer Science',
    semester: '3rd',
    section: 'A',
    attendance: '85%',
    cgpa: '8.7',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Jane Doe',
    registrationNumber: 'CS2023002',
    email: 'jane.doe@example.com',
    program: 'B.Tech',
    department: 'Computer Science',
    semester: '3rd',
    section: 'A',
    attendance: '92%',
    cgpa: '9.2',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Michael Johnson',
    registrationNumber: 'CS2023003',
    email: 'michael.johnson@example.com',
    program: 'B.Tech',
    department: 'Computer Science',
    semester: '3rd',
    section: 'B',
    attendance: '78%',
    cgpa: '7.8',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Sarah Williams',
    registrationNumber: 'CS2023004',
    email: 'sarah.williams@example.com',
    program: 'B.Tech',
    department: 'Computer Science',
    semester: '3rd',
    section: 'B',
    attendance: '95%',
    cgpa: '9.5',
    status: 'Active',
  },
  {
    id: 5,
    name: 'David Brown',
    registrationNumber: 'CS2023005',
    email: 'david.brown@example.com',
    program: 'B.Tech',
    department: 'Computer Science',
    semester: '3rd',
    section: 'A',
    attendance: '65%',
    cgpa: '6.9',
    status: 'At Risk',
  },
];

const Students = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [filter, setFilter] = useState({
    section: '',
    semester: '',
    status: '',
  });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Filter students based on search term and filters
  const filteredStudents = MOCK_STUDENTS.filter(student => {
    // Text search
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filters
    const matchesSection = filter.section ? student.section === filter.section : true;
    const matchesSemester = filter.semester ? student.semester === filter.semester : true;
    const matchesStatus = filter.status ? student.status === filter.status : true;
    
    return matchesSearch && matchesSection && matchesSemester && matchesStatus;
  });
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setViewDialogOpen(true);
  };
  
  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setFilter({
      section: '',
      semester: '',
      status: '',
    });
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PersonIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Students
            </Typography>
          </Box>
          
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 3,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white' 
            }}
          >
            <Typography variant="h6" gutterBottom>
              Student Management
            </Typography>
            <Typography variant="body1">
              View and manage students in your department. Access profiles, academic records, and communication tools.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <TextField
                placeholder="Search by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ flexGrow: 1, minWidth: '250px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl size="small" sx={{ minWidth: '120px' }}>
                <InputLabel>Section</InputLabel>
                <Select
                  name="section"
                  value={filter.section}
                  onChange={handleFilterChange}
                  label="Section"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="A">Section A</MenuItem>
                  <MenuItem value="B">Section B</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: '120px' }}>
                <InputLabel>Semester</InputLabel>
                <Select
                  name="semester"
                  value={filter.semester}
                  onChange={handleFilterChange}
                  label="Semester"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="1st">1st Semester</MenuItem>
                  <MenuItem value="2nd">2nd Semester</MenuItem>
                  <MenuItem value="3rd">3rd Semester</MenuItem>
                  <MenuItem value="4th">4th Semester</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: '120px' }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filter.status}
                  onChange={handleFilterChange}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="At Risk">At Risk</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={clearFilters}
                disabled={!filter.section && !filter.semester && !filter.status}
              >
                Clear Filters
              </Button>
            </Box>
            
            <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="All Students" />
              <Tab label="Section A" />
              <Tab label="Section B" />
            </Tabs>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reg. Number</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Program</TableCell>
                    <TableCell>Semester</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Attendance</TableCell>
                    <TableCell>CGPA</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.registrationNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.program}</TableCell>
                      <TableCell>{student.semester}</TableCell>
                      <TableCell>{student.section}</TableCell>
                      <TableCell>{student.attendance}</TableCell>
                      <TableCell>{student.cgpa}</TableCell>
                      <TableCell>
                        <Chip 
                          label={student.status} 
                          color={student.status === 'Active' ? 'success' : student.status === 'At Risk' ? 'warning' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary" 
                          size="small" 
                          onClick={() => handleViewStudent(student)}
                          title="View Profile"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="secondary" 
                          size="small" 
                          title="Send Email"
                        >
                          <EmailIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="info" 
                          size="small" 
                          title="Download Report"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {filteredStudents.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No students found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filters
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Student Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedStudent && (
          <>
            <DialogTitle>
              Student Profile: {selectedStudent.name}
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <Box sx={{ 
                  flex: '0 0 200px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  mb: { xs: 2, md: 0 } 
                }}>
                  <Avatar 
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '3rem'
                    }}
                  >
                    {selectedStudent.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">{selectedStudent.name}</Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {selectedStudent.registrationNumber}
                  </Typography>
                  <Chip 
                    label={selectedStudent.status} 
                    color={selectedStudent.status === 'Active' ? 'success' : selectedStudent.status === 'At Risk' ? 'warning' : 'error'} 
                    sx={{ mt: 1 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <IconButton color="primary" size="small">
                      <EmailIcon />
                    </IconButton>
                    <IconButton color="secondary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="info" size="small">
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                
                <Box sx={{ flex: '1 1 auto' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="overline" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="overline" color="textSecondary">
                        Department
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.department}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="overline" color="textSecondary">
                        Program
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.program}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="overline" color="textSecondary">
                        Semester
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.semester}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="overline" color="textSecondary">
                        Section
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.section}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="overline" color="textSecondary">
                        CGPA
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.cgpa}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="overline" color="textSecondary">
                        Attendance
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.attendance}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Academic Performance
                  </Typography>
                  <Typography variant="body2" paragraph>
                    This student is currently enrolled in 4 courses this semester. Overall performance is good with consistent attendance record.
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Additional Notes
                  </Typography>
                  <Typography variant="body2">
                    {selectedStudent.status === 'At Risk' ? 
                      'This student requires additional attention and guidance. Consider scheduling a meeting to discuss academic progress.' :
                      'No additional notes are available for this student.'}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViewDialog} color="primary">
                Close
              </Button>
              <Button color="primary" variant="contained">
                Send Message
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Students; 