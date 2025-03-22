import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Save as SaveIcon,
  BookmarkBorder as BookmarkBorderIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  RemoveCircleOutline as RemoveCircleOutlineIcon,
} from '@mui/icons-material';

// Mock syllabus data
const MOCK_SYLLABI = [
  {
    id: 1,
    code: "CS301",
    name: "Operating Systems",
    semester: "4th Semester",
    department: "Computer Science",
    credits: 4,
    lastUpdated: "2023-05-10",
    status: "Published",
    units: [
      {
        title: "Unit 1: OS Fundamentals",
        topics: [
          "Introduction to Operating Systems",
          "System Calls",
          "Process Management",
          "CPU Scheduling"
        ]
      },
      {
        title: "Unit 2: Memory Management",
        topics: [
          "Memory Allocation",
          "Virtual Memory",
          "Paging",
          "Segmentation"
        ]
      },
      {
        title: "Unit 3: File Systems and I/O",
        topics: [
          "File System Interface",
          "File System Implementation",
          "I/O Systems",
          "Disk Scheduling"
        ]
      }
    ],
    textbooks: [
      "Operating System Concepts by Silberschatz, Galvin, and Gagne",
      "Modern Operating Systems by Andrew S. Tanenbaum"
    ],
    references: [
      "Operating Systems: Internals and Design Principles by William Stallings",
      "The Linux Programming Interface by Michael Kerrisk"
    ]
  },
  {
    id: 2,
    code: "CS302",
    name: "Computer Networks",
    semester: "4th Semester",
    department: "Computer Science",
    credits: 4,
    lastUpdated: "2023-06-15",
    status: "Published",
    units: [
      {
        title: "Unit 1: Network Fundamentals",
        topics: [
          "Network Architecture",
          "OSI and TCP/IP Models",
          "Physical Layer",
          "Data Link Layer"
        ]
      },
      {
        title: "Unit 2: Network Protocols",
        topics: [
          "Network Layer and IP",
          "Transport Layer (TCP/UDP)",
          "Application Layer Protocols",
          "DNS and DHCP"
        ]
      },
      {
        title: "Unit 3: Network Security",
        topics: [
          "Cryptography",
          "Authentication",
          "Firewalls",
          "VPN and Wireless Security"
        ]
      }
    ],
    textbooks: [
      "Computer Networking: A Top-Down Approach by Kurose and Ross",
      "Computer Networks by Andrew S. Tanenbaum"
    ],
    references: [
      "TCP/IP Illustrated by W. Richard Stevens",
      "Network Security Essentials by William Stallings"
    ]
  },
  {
    id: 3,
    code: "CS303",
    name: "Software Engineering",
    semester: "5th Semester",
    department: "Computer Science",
    credits: 3,
    lastUpdated: "2023-07-20",
    status: "Draft",
    units: [
      {
        title: "Unit 1: Software Process Models",
        topics: [
          "Waterfall Model",
          "Agile Methodology",
          "Scrum Framework",
          "DevOps"
        ]
      },
      {
        title: "Unit 2: Software Design",
        topics: [
          "Design Principles",
          "UML Diagrams",
          "Design Patterns",
          "Architecture Styles"
        ]
      },
      {
        title: "Unit 3: Testing and Quality Assurance",
        topics: [
          "Testing Methodologies",
          "Quality Metrics",
          "Code Review",
          "Continuous Integration"
        ]
      }
    ],
    textbooks: [
      "Software Engineering by Ian Sommerville",
      "Clean Code by Robert C. Martin"
    ],
    references: [
      "Design Patterns: Elements of Reusable Object-Oriented Software by Gamma et al.",
      "The Mythical Man-Month by Frederick Brooks"
    ]
  }
];

const SyllabusManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [syllabi, setSyllabi] = useState(MOCK_SYLLABI);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // New syllabus template
  const newSyllabusTemplate = {
    id: Date.now(),
    code: "",
    name: "",
    semester: "",
    department: "Computer Science",
    credits: 3,
    lastUpdated: new Date().toISOString().split('T')[0],
    status: "Draft",
    units: [
      {
        title: "Unit 1",
        topics: [""]
      }
    ],
    textbooks: [""],
    references: [""]
  };
  
  // Form state for editing syllabus
  const [formData, setFormData] = useState(newSyllabusTemplate);
  
  // Filter syllabi based on search term
  const filteredSyllabi = syllabi.filter(syllabus => 
    syllabus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    syllabus.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Published and draft syllabi
  const publishedSyllabi = filteredSyllabi.filter(s => s.status === 'Published');
  const draftSyllabi = filteredSyllabi.filter(s => s.status === 'Draft');
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleOpenDialog = (type, syllabus = null) => {
    if (type === 'create') {
      setFormData(newSyllabusTemplate);
      setEditMode(true);
    } else if (type === 'edit' && syllabus) {
      setFormData({...syllabus});
      setEditMode(true);
    } else if (type === 'view' && syllabus) {
      setFormData({...syllabus});
      setEditMode(false);
    } else if (type === 'delete' && syllabus) {
      setSelectedSyllabus(syllabus);
    }
    
    setDialogType(type);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSyllabus(null);
    setEditMode(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleUnitTitleChange = (index, value) => {
    const updatedUnits = [...formData.units];
    updatedUnits[index] = {
      ...updatedUnits[index],
      title: value
    };
    setFormData({
      ...formData,
      units: updatedUnits
    });
  };
  
  const handleTopicChange = (unitIndex, topicIndex, value) => {
    const updatedUnits = [...formData.units];
    updatedUnits[unitIndex].topics[topicIndex] = value;
    setFormData({
      ...formData,
      units: updatedUnits
    });
  };
  
  const handleAddTopic = (unitIndex) => {
    const updatedUnits = [...formData.units];
    updatedUnits[unitIndex].topics.push("");
    setFormData({
      ...formData,
      units: updatedUnits
    });
  };
  
  const handleRemoveTopic = (unitIndex, topicIndex) => {
    const updatedUnits = [...formData.units];
    updatedUnits[unitIndex].topics.splice(topicIndex, 1);
    setFormData({
      ...formData,
      units: updatedUnits
    });
  };
  
  const handleAddUnit = () => {
    setFormData({
      ...formData,
      units: [
        ...formData.units,
        {
          title: `Unit ${formData.units.length + 1}`,
          topics: [""]
        }
      ]
    });
  };
  
  const handleRemoveUnit = (index) => {
    const updatedUnits = [...formData.units];
    updatedUnits.splice(index, 1);
    setFormData({
      ...formData,
      units: updatedUnits
    });
  };
  
  const handleTextbookChange = (index, value) => {
    const updatedTextbooks = [...formData.textbooks];
    updatedTextbooks[index] = value;
    setFormData({
      ...formData,
      textbooks: updatedTextbooks
    });
  };
  
  const handleAddTextbook = () => {
    setFormData({
      ...formData,
      textbooks: [...formData.textbooks, ""]
    });
  };
  
  const handleRemoveTextbook = (index) => {
    const updatedTextbooks = [...formData.textbooks];
    updatedTextbooks.splice(index, 1);
    setFormData({
      ...formData,
      textbooks: updatedTextbooks
    });
  };
  
  const handleReferenceChange = (index, value) => {
    const updatedReferences = [...formData.references];
    updatedReferences[index] = value;
    setFormData({
      ...formData,
      references: updatedReferences
    });
  };
  
  const handleAddReference = () => {
    setFormData({
      ...formData,
      references: [...formData.references, ""]
    });
  };
  
  const handleRemoveReference = (index) => {
    const updatedReferences = [...formData.references];
    updatedReferences.splice(index, 1);
    setFormData({
      ...formData,
      references: updatedReferences
    });
  };
  
  const handleSaveSyllabus = () => {
    const isNewSyllabus = !syllabi.find(s => s.id === formData.id);
    let updatedSyllabi;
    
    if (isNewSyllabus) {
      updatedSyllabi = [...syllabi, { ...formData, lastUpdated: new Date().toISOString().split('T')[0] }];
    } else {
      updatedSyllabi = syllabi.map(s => 
        s.id === formData.id ? { ...formData, lastUpdated: new Date().toISOString().split('T')[0] } : s
      );
    }
    
    setSyllabi(updatedSyllabi);
    setSnackbar({
      open: true,
      message: isNewSyllabus ? 'Syllabus created successfully!' : 'Syllabus updated successfully!',
      severity: 'success'
    });
    handleCloseDialog();
  };
  
  const handlePublishSyllabus = () => {
    const updatedSyllabi = syllabi.map(s => 
      s.id === formData.id ? { ...formData, status: 'Published', lastUpdated: new Date().toISOString().split('T')[0] } : s
    );
    
    setSyllabi(updatedSyllabi);
    setSnackbar({
      open: true,
      message: 'Syllabus published successfully!',
      severity: 'success'
    });
    handleCloseDialog();
  };
  
  const handleDeleteSyllabus = () => {
    if (!selectedSyllabus) return;
    
    const updatedSyllabi = syllabi.filter(s => s.id !== selectedSyllabus.id);
    setSyllabi(updatedSyllabi);
    
    setSnackbar({
      open: true,
      message: 'Syllabus deleted successfully!',
      severity: 'success'
    });
    
    handleCloseDialog();
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  const validateForm = () => {
    // Simple validation
    return formData.code.trim() !== '' && 
           formData.name.trim() !== '' && 
           formData.semester.trim() !== '' &&
           formData.credits > 0;
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Syllabus Management
          </Typography>
          
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
              Manage Course Syllabi
            </Typography>
            <Typography variant="body1">
              Create, edit, and publish syllabi for your courses. Students will see published syllabi in their portal.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <TextField
                placeholder="Search by course name or code..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: '40%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('create')}
              >
                Create New Syllabus
              </Button>
            </Box>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={currentTab} onChange={handleTabChange}>
                <Tab label="Published Syllabi" />
                <Tab label="Draft Syllabi" />
              </Tabs>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              {currentTab === 0 ? (
                publishedSyllabi.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Course Name</TableCell>
                          <TableCell>Semester</TableCell>
                          <TableCell>Credits</TableCell>
                          <TableCell>Last Updated</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {publishedSyllabi.map((syllabus) => (
                          <TableRow key={syllabus.id}>
                            <TableCell>{syllabus.code}</TableCell>
                            <TableCell>{syllabus.name}</TableCell>
                            <TableCell>{syllabus.semester}</TableCell>
                            <TableCell>{syllabus.credits}</TableCell>
                            <TableCell>{syllabus.lastUpdated}</TableCell>
                            <TableCell>
                              <Chip 
                                label={syllabus.status} 
                                color="success" 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton 
                                color="primary" 
                                size="small"
                                onClick={() => handleOpenDialog('view', syllabus)}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                color="secondary" 
                                size="small"
                                onClick={() => handleOpenDialog('edit', syllabus)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                color="error" 
                                size="small"
                                onClick={() => handleOpenDialog('delete', syllabus)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No published syllabi found.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create and publish a syllabus to see it here.
                    </Typography>
                  </Box>
                )
              ) : (
                draftSyllabi.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Course Name</TableCell>
                          <TableCell>Semester</TableCell>
                          <TableCell>Credits</TableCell>
                          <TableCell>Last Updated</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {draftSyllabi.map((syllabus) => (
                          <TableRow key={syllabus.id}>
                            <TableCell>{syllabus.code}</TableCell>
                            <TableCell>{syllabus.name}</TableCell>
                            <TableCell>{syllabus.semester}</TableCell>
                            <TableCell>{syllabus.credits}</TableCell>
                            <TableCell>{syllabus.lastUpdated}</TableCell>
                            <TableCell>
                              <Chip 
                                label={syllabus.status} 
                                color="warning" 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton 
                                color="primary" 
                                size="small"
                                onClick={() => handleOpenDialog('view', syllabus)}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                color="secondary" 
                                size="small"
                                onClick={() => handleOpenDialog('edit', syllabus)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                color="error" 
                                size="small"
                                onClick={() => handleOpenDialog('delete', syllabus)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No draft syllabi found.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create a new syllabus to start drafting.
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* View/Edit Syllabus Dialog */}
      <Dialog
        open={openDialog && ['view', 'edit', 'create'].includes(dialogType)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'create' ? 'Create New Syllabus' : 
           dialogType === 'edit' ? 'Edit Syllabus' : 'View Syllabus'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Course Code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Course Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth disabled={!editMode}>
                  <InputLabel>Semester</InputLabel>
                  <Select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    label="Semester"
                  >
                    <MenuItem value="">Select Semester</MenuItem>
                    <MenuItem value="1st Semester">1st Semester</MenuItem>
                    <MenuItem value="2nd Semester">2nd Semester</MenuItem>
                    <MenuItem value="3rd Semester">3rd Semester</MenuItem>
                    <MenuItem value="4th Semester">4th Semester</MenuItem>
                    <MenuItem value="5th Semester">5th Semester</MenuItem>
                    <MenuItem value="6th Semester">6th Semester</MenuItem>
                    <MenuItem value="7th Semester">7th Semester</MenuItem>
                    <MenuItem value="8th Semester">8th Semester</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Credits"
                  name="credits"
                  type="number"
                  value={formData.credits}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  InputProps={{ inputProps: { min: 1, max: 8 } }}
                  required
                />
              </Grid>
              
              {/* Units */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Course Units
                  </Typography>
                  {editMode && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddUnit}
                    >
                      Add Unit
                    </Button>
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              {formData.units.map((unit, unitIndex) => (
                <Grid item xs={12} key={unitIndex}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <TextField
                          label={`Unit ${unitIndex + 1} Title`}
                          value={unit.title}
                          onChange={(e) => handleUnitTitleChange(unitIndex, e.target.value)}
                          disabled={!editMode}
                          fullWidth
                          sx={{ mr: 2 }}
                        />
                        {editMode && (
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemoveUnit(unitIndex)}
                            disabled={formData.units.length <= 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Topics:
                      </Typography>
                      
                      {unit.topics.map((topic, topicIndex) => (
                        <Box key={topicIndex} sx={{ display: 'flex', mb: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={topic}
                            onChange={(e) => handleTopicChange(unitIndex, topicIndex, e.target.value)}
                            disabled={!editMode}
                            placeholder={`Topic ${topicIndex + 1}`}
                          />
                          {editMode && (
                            <IconButton 
                              color="error" 
                              size="small"
                              onClick={() => handleRemoveTopic(unitIndex, topicIndex)}
                              disabled={unit.topics.length <= 1}
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      
                      {editMode && (
                        <Button
                          size="small"
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={() => handleAddTopic(unitIndex)}
                          sx={{ mt: 1 }}
                        >
                          Add Topic
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              
              {/* Textbooks */}
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Textbooks
                  </Typography>
                  {editMode && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddTextbook}
                    >
                      Add Textbook
                    </Button>
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              {formData.textbooks.map((textbook, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <TextField
                      fullWidth
                      value={textbook}
                      onChange={(e) => handleTextbookChange(index, e.target.value)}
                      disabled={!editMode}
                      placeholder="Enter textbook with author"
                    />
                    {editMode && (
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveTextbook(index)}
                        disabled={formData.textbooks.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              ))}
              
              {/* References */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Reference Materials
                  </Typography>
                  {editMode && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddReference}
                    >
                      Add Reference
                    </Button>
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              {formData.references.map((reference, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <TextField
                      fullWidth
                      value={reference}
                      onChange={(e) => handleReferenceChange(index, e.target.value)}
                      disabled={!editMode}
                      placeholder="Enter reference material"
                    />
                    {editMode && (
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveReference(index)}
                        disabled={formData.references.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          {editMode && (
            <>
              <Button 
                onClick={handleSaveSyllabus} 
                variant="contained" 
                color="primary"
                disabled={!validateForm()}
                startIcon={<SaveIcon />}
              >
                Save as Draft
              </Button>
              <Button 
                onClick={handlePublishSyllabus} 
                variant="contained" 
                color="success"
                disabled={!validateForm()}
                startIcon={<CloudUploadIcon />}
              >
                Publish
              </Button>
            </>
          )}
          {!editMode && dialogType === 'view' && (
            <>
              <Button 
                onClick={() => {
                  setEditMode(true);
                  setDialogType('edit');
                }} 
                variant="contained" 
                color="secondary"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<CloudDownloadIcon />}
              >
                Download PDF
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog && dialogType === 'delete'}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Syllabus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the syllabus for <strong>{selectedSyllabus?.code}: {selectedSyllabus?.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteSyllabus} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SyllabusManagement; 