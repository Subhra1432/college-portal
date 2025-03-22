import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

// Mock course data
const MOCK_COURSES = [
  {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. John Smith',
    credits: 4,
    progress: 65,
    status: 'In Progress',
    schedule: 'Mon, Wed, Fri - 10:00 AM to 11:30 AM',
    description: 'This course provides an introduction to computer science and programming concepts.',
  },
  {
    id: 2,
    code: 'MATH201',
    name: 'Calculus II',
    instructor: 'Dr. Jane Doe',
    credits: 3,
    progress: 80,
    status: 'In Progress',
    schedule: 'Tue, Thu - 1:00 PM to 3:00 PM',
    description: 'This course covers advanced calculus concepts including integration techniques and applications.',
  },
  {
    id: 3,
    code: 'PHY101',
    name: 'Physics I: Mechanics',
    instructor: 'Dr. Robert Johnson',
    credits: 4,
    progress: 50,
    status: 'In Progress',
    schedule: 'Mon, Wed - 2:00 PM to 4:00 PM',
    description: 'This course covers Newtonian mechanics, including kinematics, dynamics, and conservation laws.',
  },
  {
    id: 4,
    code: 'ENG202',
    name: 'Technical Communication',
    instructor: 'Prof. Sarah Williams',
    credits: 2,
    progress: 90,
    status: 'In Progress',
    schedule: 'Fri - 9:00 AM to 11:00 AM',
    description: 'Develop effective technical writing and presentation skills for engineering and scientific contexts.',
  },
];

const Courses = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <MenuBookIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              My Courses
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
              Current Semester: {user?.semester || '3rd Semester'}
            </Typography>
            <Typography variant="body1">
              You are currently enrolled in {MOCK_COURSES.length} courses. 
              View detailed information about each course, including schedules, materials, and assignments.
            </Typography>
          </Paper>
        </Grid>
        
        {MOCK_COURSES.map((course) => (
          <Grid item xs={12} md={6} key={course.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {course.code}: {course.name}
                  </Typography>
                  <Chip 
                    label={course.status} 
                    color="primary" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.instructor}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.schedule}
                  </Typography>
                </Box>
                
                <Typography variant="body2" paragraph>
                  {course.description}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Course Progress: {course.progress}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={course.progress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button size="small" color="primary">View Materials</Button>
                <Button size="small" color="primary">Assignments</Button>
                <Button size="small" color="primary">Discussions</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Courses; 