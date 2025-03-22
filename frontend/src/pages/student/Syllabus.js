import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CloudDownload as CloudDownloadIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

// Mock syllabus data
const MOCK_SYLLABUS_DATA = [
  {
    semester: "1st Semester",
    subjects: [
      {
        code: "PHY101",
        name: "Physics I",
        credits: 4,
        units: [
          {
            title: "Unit 1: Mechanics",
            topics: [
              "Newton's Laws of Motion",
              "Work, Energy, and Power",
              "Rotational Dynamics",
              "Gravitation"
            ]
          },
          {
            title: "Unit 2: Oscillations and Waves",
            topics: [
              "Simple Harmonic Motion",
              "Damped and Forced Oscillations",
              "Wave Motion",
              "Sound Waves"
            ]
          },
          {
            title: "Unit 3: Thermodynamics",
            topics: [
              "Temperature and Heat",
              "Laws of Thermodynamics",
              "Entropy",
              "Heat Engines"
            ]
          }
        ],
        textbooks: [
          "Fundamentals of Physics by Halliday, Resnick, and Walker",
          "University Physics by Young and Freedman"
        ],
        references: [
          "Concepts of Physics by H.C. Verma",
          "Physics for Scientists and Engineers by Serway and Jewett"
        ]
      },
      {
        code: "MATH101",
        name: "Mathematics I",
        credits: 4,
        units: [
          {
            title: "Unit 1: Calculus",
            topics: [
              "Limits and Continuity",
              "Differentiation",
              "Applications of Derivatives",
              "Integration",
              "Applications of Integrals"
            ]
          },
          {
            title: "Unit 2: Linear Algebra",
            topics: [
              "Matrices and Determinants",
              "Systems of Linear Equations",
              "Vector Spaces",
              "Eigenvalues and Eigenvectors"
            ]
          },
          {
            title: "Unit 3: Differential Equations",
            topics: [
              "First Order Differential Equations",
              "Second Order Differential Equations",
              "Applications in Engineering",
              "Series Solutions"
            ]
          }
        ],
        textbooks: [
          "Calculus by Thomas",
          "Linear Algebra and Its Applications by Gilbert Strang"
        ],
        references: [
          "Advanced Engineering Mathematics by Erwin Kreyszig",
          "Calculus: Early Transcendentals by James Stewart"
        ]
      }
    ]
  },
  {
    semester: "2nd Semester",
    subjects: [
      {
        code: "CS101",
        name: "Introduction to Computer Science",
        credits: 3,
        units: [
          {
            title: "Unit 1: Computer Fundamentals",
            topics: [
              "Computer Organization",
              "Binary Number System",
              "Boolean Algebra",
              "Logic Gates"
            ]
          },
          {
            title: "Unit 2: Programming Basics",
            topics: [
              "Algorithms and Flowcharts",
              "Programming Paradigms",
              "Introduction to C/C++",
              "Data Types and Variables"
            ]
          },
          {
            title: "Unit 3: Data Structures",
            topics: [
              "Arrays and Strings",
              "Linked Lists",
              "Stacks and Queues",
              "Introduction to Trees"
            ]
          }
        ],
        textbooks: [
          "Computer Science: An Overview by J. Glenn Brookshear",
          "C Programming Language by Kernighan and Ritchie"
        ],
        references: [
          "Introduction to Algorithms by Cormen, Leiserson, Rivest, and Stein",
          "Data Structures and Algorithms by Alfred V. Aho"
        ]
      },
      {
        code: "ENG101",
        name: "Technical Communication",
        credits: 2,
        units: [
          {
            title: "Unit 1: Communication Fundamentals",
            topics: [
              "Elements of Communication",
              "Barriers to Communication",
              "Technical Writing",
              "Report Writing"
            ]
          },
          {
            title: "Unit 2: Presentation Skills",
            topics: [
              "Oral Presentation",
              "Visual Aids",
              "Body Language",
              "Audience Analysis"
            ]
          },
          {
            title: "Unit 3: Business Communication",
            topics: [
              "Business Letters",
              "Memos and Emails",
              "Job Applications",
              "Resume and CV Preparation"
            ]
          }
        ],
        textbooks: [
          "Technical Communication by Meenakshi Raman and Sangeeta Sharma",
          "Business Communication Today by Bovee and Thill"
        ],
        references: [
          "The Handbook of Technical Writing by Gerald J. Alred",
          "Effective Technical Communication by M. Ashraf Rizvi"
        ]
      }
    ]
  },
  {
    semester: "3rd Semester",
    subjects: [
      {
        code: "CS201",
        name: "Data Structures and Algorithms",
        credits: 4,
        units: [
          {
            title: "Unit 1: Advanced Data Structures",
            topics: [
              "Trees and Binary Trees",
              "Balanced Trees (AVL, Red-Black)",
              "Heaps and Priority Queues",
              "Graphs"
            ]
          },
          {
            title: "Unit 2: Algorithm Design Techniques",
            topics: [
              "Greedy Algorithms",
              "Divide and Conquer",
              "Dynamic Programming",
              "Backtracking"
            ]
          },
          {
            title: "Unit 3: Algorithm Analysis",
            topics: [
              "Time Complexity",
              "Space Complexity",
              "Big-O, Big-Omega, and Big-Theta Notations",
              "NP-Completeness"
            ]
          }
        ],
        textbooks: [
          "Introduction to Algorithms by Cormen, Leiserson, Rivest, and Stein",
          "Data Structures and Algorithm Analysis in C++ by Mark Allen Weiss"
        ],
        references: [
          "Algorithms by Robert Sedgewick and Kevin Wayne",
          "The Algorithm Design Manual by Steven S. Skiena"
        ]
      },
      {
        code: "CS202",
        name: "Database Management Systems",
        credits: 4,
        units: [
          {
            title: "Unit 1: Database Concepts",
            topics: [
              "Introduction to DBMS",
              "Data Models",
              "Entity-Relationship Model",
              "Relational Model"
            ]
          },
          {
            title: "Unit 2: SQL",
            topics: [
              "Data Definition Language (DDL)",
              "Data Manipulation Language (DML)",
              "Data Control Language (DCL)",
              "Transactions and Concurrency"
            ]
          },
          {
            title: "Unit 3: Database Design",
            topics: [
              "Normalization",
              "Database Security",
              "Indexing",
              "Query Optimization"
            ]
          }
        ],
        textbooks: [
          "Database System Concepts by Silberschatz, Korth, and Sudarshan",
          "Database Management Systems by Ramakrishnan and Gehrke"
        ],
        references: [
          "Fundamentals of Database Systems by Elmasri and Navathe",
          "SQL: The Complete Reference by James R. Groff"
        ]
      }
    ]
  },
  {
    semester: "4th Semester",
    subjects: [
      {
        code: "CS301",
        name: "Operating Systems",
        credits: 4,
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
        code: "CS302",
        name: "Computer Networks",
        credits: 4,
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
      }
    ]
  }
];

const Syllabus = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(0);
  const [expandedSubject, setExpandedSubject] = useState(null);

  // Filter syllabus based on search term
  const filteredSyllabus = MOCK_SYLLABUS_DATA.map(semester => ({
    ...semester,
    subjects: semester.subjects.filter(subject => 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(semester => semester.subjects.length > 0);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSemesterChange = (event, newValue) => {
    setSelectedSemester(newValue);
  };

  const handleExpandSubject = (subjectCode) => {
    setExpandedSubject(expandedSubject === subjectCode ? null : subjectCode);
  };

  const handleDownloadSyllabus = (subject) => {
    // This would be an API call to download the syllabus PDF
    console.log(`Downloading syllabus for ${subject.code}: ${subject.name}`);
    alert(`Downloading syllabus for ${subject.name}. This feature will be implemented with actual files in production.`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SchoolIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Course Syllabus
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
              {user?.program || 'B.Tech. in Computer Science Engineering'}
            </Typography>
            <Typography variant="body1">
              View detailed course syllabi for your program. Each syllabus includes course objectives, 
              unit-wise content breakdown, recommended textbooks, and reference materials.
            </Typography>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by course name or code..."
                value={searchTerm}
                onChange={handleSearch}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton color="primary" sx={{ ml: 1 }}>
                <FilterListIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={selectedSemester} 
                onChange={handleSemesterChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {filteredSyllabus.map((semester, index) => (
                  <Tab 
                    key={index} 
                    label={semester.semester} 
                    id={`syllabus-tab-${index}`}
                    aria-controls={`syllabus-tabpanel-${index}`}
                  />
                ))}
              </Tabs>
            </Box>
            
            {filteredSyllabus.map((semester, semesterIndex) => (
              <div
                key={semesterIndex}
                role="tabpanel"
                hidden={selectedSemester !== semesterIndex}
                id={`syllabus-tabpanel-${semesterIndex}`}
                aria-labelledby={`syllabus-tab-${semesterIndex}`}
              >
                {selectedSemester === semesterIndex && (
                  <Grid container spacing={3}>
                    {semester.subjects.map((subject) => (
                      <Grid item xs={12} key={subject.code}>
                        <Card elevation={2}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="h6" component="div">
                                  {subject.code}: {subject.name}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Credits: {subject.credits}
                                </Typography>
                              </Box>
                              <Chip 
                                icon={<BookIcon />} 
                                label={`${subject.units.length} Units`} 
                                color="primary" 
                                variant="outlined" 
                              />
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            {expandedSubject === subject.code ? (
                              <Box>
                                {subject.units.map((unit, unitIndex) => (
                                  <Box key={unitIndex} sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                      {unit.title}
                                    </Typography>
                                    <List dense>
                                      {unit.topics.map((topic, topicIndex) => (
                                        <ListItem key={topicIndex}>
                                          <ListItemText primary={topic} />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Box>
                                ))}
                                
                                <Box sx={{ mt: 3 }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    Textbooks:
                                  </Typography>
                                  <List dense>
                                    {subject.textbooks.map((book, bookIndex) => (
                                      <ListItem key={bookIndex}>
                                        <ListItemText primary={book} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Box>
                                
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    Reference Materials:
                                  </Typography>
                                  <List dense>
                                    {subject.references.map((ref, refIndex) => (
                                      <ListItem key={refIndex}>
                                        <ListItemText primary={ref} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Box>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Click "View Details" to see the complete syllabus for this course.
                              </Typography>
                            )}
                          </CardContent>
                          <CardActions>
                            <Button 
                              size="small" 
                              startIcon={<DescriptionIcon />}
                              onClick={() => handleExpandSubject(subject.code)}
                            >
                              {expandedSubject === subject.code ? 'Hide Details' : 'View Details'}
                            </Button>
                            <Button 
                              size="small" 
                              startIcon={<CloudDownloadIcon />}
                              onClick={() => handleDownloadSyllabus(subject)}
                            >
                              Download PDF
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </div>
            ))}
            
            {filteredSyllabus.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No courses found matching your search.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try a different search term or clear the search field.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Syllabus; 