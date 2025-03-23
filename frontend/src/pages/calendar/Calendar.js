import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  SportsEsports as SportsIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Dummy data for calendar events
const DUMMY_EVENTS = [
  {
    id: 1,
    title: 'Mid-Semester Examination',
    description: 'Mid-semester examinations for all courses',
    date: '2023-03-15',
    type: 'exam',
  },
  {
    id: 2,
    title: 'Project Submission Deadline',
    description: 'Final submission deadline for semester projects',
    date: '2023-03-18',
    type: 'assignment',
  },
  {
    id: 3,
    title: 'Annual Sports Day',
    description: 'College annual sports day celebrations',
    date: '2023-03-25',
    type: 'event',
  },
  {
    id: 4,
    title: 'Guest Lecture: AI in Healthcare',
    description: 'Guest lecture by Dr. Smith on applications of AI in healthcare',
    date: '2023-03-10',
    type: 'lecture',
  },
  {
    id: 5,
    title: 'Programming Contest',
    description: 'Intra-college programming competition',
    date: '2023-03-22',
    type: 'event',
  },
];

const Calendar = () => {
  const { user } = useSelector((state) => state.auth);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  
  const isTeacher = user?.role === 'teacher';
  
  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  // Helper function to get month name
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  // Helper function to get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Helper function to get day of week
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Format date as YYYY-MM-DD
  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Get events for a specific date
  const getEventsForDate = (year, month, day) => {
    const dateString = formatDate(year, month, day);
    return DUMMY_EVENTS.filter(event => event.date === dateString);
  };
  
  // Handle date selection
  const handleDateClick = (year, month, day) => {
    setSelectedDate(new Date(year, month, day));
  };
  
  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenEventDialog(true);
  };
  
  // Close event dialog
  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
    setSelectedEvent(null);
  };
  
  // Get event type color
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'exam':
        return 'error';
      case 'assignment':
        return 'primary';
      case 'lecture':
        return 'info';
      case 'event':
        return 'success';
      default:
        return 'default';
    }
  };
  
  // Get event type icon
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'exam':
        return <SchoolIcon fontSize="small" />;
      case 'assignment':
        return <AssignmentIcon fontSize="small" />;
      case 'event':
        return <EventIcon fontSize="small" />;
      case 'lecture':
        return <SchoolIcon fontSize="small" />;
      default:
        return <EventIcon fontSize="small" />;
    }
  };
  
  // Render calendar grid
  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const today = new Date();
    
    // Create array of day elements
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <Box key={`empty-${i}`} sx={{ 
          p: 1, 
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)', 
          borderRight: '1px solid rgba(0, 0, 0, 0.12)', 
          height: { xs: 'auto', md: '100px' },
          minHeight: { xs: '60px', md: '80px' },
          maxHeight: { xs: '80px', md: '100px' }
        }} />
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
      const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
      const events = getEventsForDate(year, month, day);
      
      days.push(
        <Box 
          key={`day-${day}`} 
          onClick={() => handleDateClick(year, month, day)}
          sx={{ 
            p: 1, 
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)', 
            borderRight: '1px solid rgba(0, 0, 0, 0.12)', 
            height: { xs: 'auto', md: '100px' },
            minHeight: { xs: '60px', md: '80px' },
            maxHeight: { xs: '80px', md: '100px' },
            backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: isToday ? 'bold' : 'normal',
              backgroundColor: isToday ? 'primary.main' : 'transparent',
              color: isToday ? 'white' : 'inherit',
              display: 'inline-block',
              width: 24,
              height: 24,
              borderRadius: '50%',
              textAlign: 'center',
              lineHeight: '24px',
            }}
          >
            {day}
          </Typography>
          
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
            {events.slice(0, 2).map(event => (
              <Chip
                key={event.id}
                size="small"
                label={event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title}
                color={getEventTypeColor(event.type)}
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick(event);
                }}
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
            
            {events.length > 2 && (
              <Typography variant="caption" color="text.secondary">
                +{events.length - 2} more
              </Typography>
            )}
          </Box>
        </Box>
      );
    }
    
    return days;
  };
  
  // Render events for selected date
  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null;
    
    const events = getEventsForDate(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    
    if (events.length === 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">No events for this date</Typography>
        </Box>
      );
    }
    
    return (
      <List>
        {events.map((event) => (
          <React.Fragment key={event.id}>
            <ListItem
              button
              onClick={() => handleEventClick(event)}
            >
              <Box sx={{ display: 'flex', width: '100%' }}>
                <Box sx={{ mr: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: `${getEventTypeColor(event.type)}.main`,
                      mt: 1.5,
                    }}
                  />
                </Box>
                <ListItemText
                  primary={event.title}
                  secondary={event.description}
                />
                <Chip
                  icon={getEventTypeIcon(event.type)}
                  label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  color={getEventTypeColor(event.type)}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    );
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Academic Calendar
          </Typography>
          
          {isTeacher && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setShowAddEvent(true)}
            >
              Add Event
            </Button>
          )}
        </Grid>
        
        {/* Calendar Navigation */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <IconButton onClick={goToPreviousMonth}>
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton onClick={goToNextMonth}>
                  <ChevronRightIcon />
                </IconButton>
                <Button variant="text" onClick={goToToday}>
                  Today
                </Button>
              </Box>
              
              <Typography variant="h6">
                {getMonthName(currentDate)} {currentDate.getFullYear()}
              </Typography>
              
              <Box>
                <Chip
                  icon={<SchoolIcon />}
                  label="Exam"
                  color="error"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  icon={<AssignmentIcon />}
                  label="Assignment"
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  icon={<EventIcon />}
                  label="Event"
                  color="success"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Calendar and Event List */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            {/* Day of week headers */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Typography 
                  key={day} 
                  variant="subtitle2" 
                  align="center"
                  sx={{ 
                    py: 1,
                    fontWeight: 'bold',
                    color: day === 'Sun' ? 'error.main' : 'inherit',
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>
            
            {/* Calendar grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
              width: '100%',
              height: 'auto',
              aspectRatio: { xs: 'initial', md: '7/5' },
            }}
            className="calendar-grid">
              {renderCalendarGrid()}
            </Box>
          </Paper>
        </Grid>
        
        {/* Selected Date Events */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
              <Typography variant="h6">
                {selectedDate ? (
                  `Events for ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                ) : (
                  'Select a date to view events'
                )}
              </Typography>
            </Box>
            {renderSelectedDateEvents()}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Event Detail Dialog */}
      <Dialog
        open={openEventDialog}
        onClose={handleCloseEventDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              {selectedEvent.title}
              <IconButton
                aria-label="close"
                onClick={handleCloseEventDialog}
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
              <Box sx={{ mb: 2 }}>
                <Chip
                  icon={getEventTypeIcon(selectedEvent.type)}
                  label={selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  color={getEventTypeColor(selectedEvent.type)}
                  variant="outlined"
                />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                  Date: {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {selectedEvent.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEventDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Add Event Dialog - would be implemented in a real app */}
    </Container>
  );
};

export default Calendar; 