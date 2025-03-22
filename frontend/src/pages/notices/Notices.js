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
  CardHeader,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Dummy data for displaying notices
const DUMMY_NOTICES = [
  {
    id: 1,
    title: 'End of Semester Examination Schedule',
    content: 'The end of semester examinations will commence from 15th April 2023. The detailed schedule is now available on the college portal. Students are advised to check their respective timetables and prepare accordingly.',
    category: 'exam',
    author: 'Examination Department',
    date: '2023-03-15T10:30:00',
    important: true,
  },
  {
    id: 2,
    title: 'Annual Cultural Fest',
    content: 'The annual cultural fest "Expressions 2023" will be held from 20th to 22nd March 2023. Students interested in participating should register with their respective department coordinators by 10th March.',
    category: 'event',
    author: 'Cultural Committee',
    date: '2023-03-05T14:15:00',
    important: false,
  },
  {
    id: 3,
    title: 'Library Hours Extended',
    content: 'The college library will remain open until 9:00 PM on weekdays and 5:00 PM on Saturdays during the examination period (April 10-30, 2023). Students are encouraged to utilize this facility for exam preparation.',
    category: 'general',
    author: 'Library Department',
    date: '2023-03-12T09:45:00',
    important: false,
  },
  {
    id: 4,
    title: 'Fee Payment Reminder',
    content: 'Students are reminded that the last date for payment of tuition fees for the upcoming semester is March 31, 2023. Late payments will attract a penalty as per college regulations.',
    category: 'fees',
    author: 'Accounts Department',
    date: '2023-03-10T11:20:00',
    important: true,
  },
  {
    id: 5,
    title: 'Job Fair 2023',
    content: 'The annual job fair will be held on April 5, 2023, in the college auditorium. Several companies from IT, finance, and other sectors will be participating. Final year students are required to attend with their updated resumes.',
    category: 'event',
    author: 'Placement Cell',
    date: '2023-03-18T13:00:00',
    important: true,
  },
];

const Notices = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [openNotice, setOpenNotice] = useState(null);
  const [showAddNotice, setShowAddNotice] = useState(false);
  
  const isTeacher = user?.role === 'teacher';
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getFilteredNotices = () => {
    return DUMMY_NOTICES
      .filter(notice => {
        // Filter by search query
        if (searchQuery) {
          return (
            notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notice.author.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        // Filter by tab
        if (activeTab === 0) return true; // All notices
        if (activeTab === 1) return notice.important; // Important notices
        if (activeTab === 2) return notice.category === 'exam'; // Exam related
        if (activeTab === 3) return notice.category === 'event'; // Events
        
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (newest first)
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'exam':
        return <SchoolIcon fontSize="small" />;
      case 'event':
        return <EventIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };
  
  const getCategoryColor = (category) => {
    switch (category) {
      case 'exam':
        return 'primary';
      case 'event':
        return 'success';
      case 'fees':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  const handleOpenNotice = (notice) => {
    setOpenNotice(notice);
  };
  
  const handleCloseNotice = () => {
    setOpenNotice(null);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Notices & Announcements
          </Typography>
          
          {isTeacher && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setShowAddNotice(true)}
            >
              Create Notice
            </Button>
          )}
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                placeholder="Search notices..."
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
            
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              <Tab label="All Notices" />
              <Tab 
                label="Important" 
                icon={<NotificationsIcon fontSize="small" color="error" />} 
                iconPosition="start"
              />
              <Tab
                label="Exam Related"
                icon={<SchoolIcon fontSize="small" color="primary" />}
                iconPosition="start"
              />
              <Tab
                label="Events"
                icon={<EventIcon fontSize="small" color="success" />}
                iconPosition="start"
              />
            </Tabs>
            
            <Divider sx={{ mb: 2 }} />
            
            {getFilteredNotices().length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="textSecondary">No notices found</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {getFilteredNotices().map(notice => (
                  <Grid item xs={12} key={notice.id}>
                    <Card 
                      variant="outlined"
                      sx={{
                        borderLeft: notice.important ? '4px solid #f44336' : 'none',
                      }}
                    >
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: getCategoryColor(notice.category) + '.main' }}>
                            {getCategoryIcon(notice.category)}
                          </Avatar>
                        }
                        title={notice.title}
                        subheader={`${notice.author} • ${formatDate(notice.date)}`}
                        action={
                          <Chip
                            label={notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                            color={getCategoryColor(notice.category)}
                            size="small"
                            variant="outlined"
                          />
                        }
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {notice.content}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => handleOpenNotice(notice)}>Read More</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Notice Detail Dialog */}
      <Dialog
        open={!!openNotice}
        onClose={handleCloseNotice}
        scroll="paper"
        maxWidth="md"
        fullWidth
      >
        {openNotice && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              {openNotice.title}
              <IconButton
                aria-label="close"
                onClick={handleCloseNotice}
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
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Posted by: {openNotice.author}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {formatDate(openNotice.date)}
                </Typography>
              </Box>
              <Chip
                icon={getCategoryIcon(openNotice.category)}
                label={openNotice.category.charAt(0).toUpperCase() + openNotice.category.slice(1)}
                color={getCategoryColor(openNotice.category)}
                size="small"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <DialogContentText>
                {openNotice.content}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseNotice}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Add Notice Dialog - would be implemented in a real app */}
    </Container>
  );
};

export default Notices; 