import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  Avatar,
  TextField,
  Button,
  Divider,
  IconButton,
  Badge,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Dummy data for displaying messages
const DUMMY_CONTACTS = [
  { id: 1, name: 'John Smith', role: 'student', unread: 3, lastMessage: 'Hello, I have a question about the assignment...' },
  { id: 2, name: 'Jane Doe', role: 'teacher', unread: 0, lastMessage: 'Thank you for submitting your work' },
  { id: 3, name: 'Michael Johnson', role: 'student', unread: 1, lastMessage: 'When is the next class?' },
  { id: 4, name: 'Academic Department', role: 'admin', unread: 0, lastMessage: 'Notice regarding semester exams' },
  { id: 5, name: 'Library', role: 'admin', unread: 0, lastMessage: 'Your book return date is approaching' },
];

// Initial dummy messages
const INITIAL_DUMMY_MESSAGES = [
  { id: 1, sender: 1, receiver: 'me', text: 'Hello, I have a question about the assignment...', timestamp: '2023-03-21T14:30:00' },
  { id: 2, sender: 'me', receiver: 1, text: 'Sure, what do you need help with?', timestamp: '2023-03-21T14:35:00' },
  { id: 3, sender: 1, receiver: 'me', text: 'I\'m not sure how to approach question 3 on the calculus problem set.', timestamp: '2023-03-21T14:40:00' },
  { id: 4, sender: 'me', receiver: 1, text: 'For question 3, you need to apply the chain rule for differentiation. Start by identifying the inner and outer functions.', timestamp: '2023-03-21T14:45:00' },
  { id: 5, sender: 1, receiver: 'me', text: 'Oh, I see now. Thank you for the explanation!', timestamp: '2023-03-21T14:50:00' },
];

const Messages = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(INITIAL_DUMMY_MESSAGES);
  
  // State for message actions (edit, delete)
  const [messageMenuAnchorEl, setMessageMenuAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Filter contacts based on search query
  const filteredContacts = DUMMY_CONTACTS.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get messages for selected contact
  const contactMessages = messages.filter(message => 
    (message.sender === selectedContact && message.receiver === 'me') || 
    (message.sender === 'me' && message.receiver === selectedContact)
  );
  
  // Select a contact
  const handleContactSelect = (contactId) => {
    setSelectedContact(contactId);
    // Reset any editing state
    setEditMode(false);
    setEditText('');
    setSelectedMessage(null);
  };
  
  // Send a new message
  const handleSendMessage = () => {
    if (messageText.trim() && selectedContact) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'me',
        receiver: selectedContact,
        text: messageText,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      
      // Update last message in contact list
      const contactIndex = DUMMY_CONTACTS.findIndex(c => c.id === selectedContact);
      if (contactIndex !== -1) {
        DUMMY_CONTACTS[contactIndex].lastMessage = messageText;
        DUMMY_CONTACTS[contactIndex].unread = 0;
      }
      
      setSnackbar({
        open: true,
        message: 'Message sent successfully',
        severity: 'success'
      });
    }
  };
  
  // Open message action menu
  const handleMessageMenuOpen = (event, message) => {
    if (message.sender === 'me') {
      setMessageMenuAnchorEl(event.currentTarget);
      setSelectedMessage(message);
    }
  };
  
  // Close message action menu
  const handleMessageMenuClose = () => {
    setMessageMenuAnchorEl(null);
  };
  
  // Start editing a message
  const handleEditStart = () => {
    setEditMode(true);
    setEditText(selectedMessage.text);
    handleMessageMenuClose();
  };
  
  // Cancel editing a message
  const handleEditCancel = () => {
    setEditMode(false);
    setEditText('');
    setSelectedMessage(null);
  };
  
  // Save edited message
  const handleEditSave = () => {
    if (editText.trim() && selectedMessage) {
      setMessages(prev => prev.map(message => 
        message.id === selectedMessage.id 
          ? { ...message, text: editText } 
          : message
      ));
      
      setEditMode(false);
      setEditText('');
      setSelectedMessage(null);
      
      setSnackbar({
        open: true,
        message: 'Message updated successfully',
        severity: 'success'
      });
    }
  };
  
  // Open delete confirmation dialog
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMessageMenuClose();
  };
  
  // Cancel message deletion
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  
  // Confirm message deletion
  const handleDeleteConfirm = () => {
    setMessages(prev => prev.filter(message => message.id !== selectedMessage.id));
    setDeleteDialogOpen(false);
    setSelectedMessage(null);
    
    setSnackbar({
      open: true,
      message: 'Message deleted successfully',
      severity: 'success'
    });
  };
  
  // Close snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Format message time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Messages
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Divider />
            
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
              {filteredContacts.map(contact => (
                <ListItem
                  key={contact.id}
                  button
                  selected={selectedContact === contact.id}
                  onClick={() => handleContactSelect(contact.id)}
                  sx={{
                    backgroundColor: selectedContact === contact.id ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={contact.unread}
                      color="primary"
                      invisible={contact.unread === 0}
                    >
                      <Avatar>
                        {contact.name.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.name}
                    secondary={contact.lastMessage}
                    secondaryTypographyProps={{
                      noWrap: true,
                      style: { maxWidth: '180px' },
                    }}
                  />
                </ListItem>
              ))}
              
              {filteredContacts.length === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography color="textSecondary">No contacts found</Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {selectedContact ? (
              <>
                {/* Message header */}
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <Avatar sx={{ mr: 2 }}>
                    {DUMMY_CONTACTS.find(c => c.id === selectedContact)?.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">
                    {DUMMY_CONTACTS.find(c => c.id === selectedContact)?.name}
                  </Typography>
                </Box>
                
                {/* Message list */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  {contactMessages.map(message => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                        mb: 2,
                        position: 'relative',
                      }}
                    >
                      {message.sender !== 'me' && (
                        <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                          {DUMMY_CONTACTS.find(c => c.id === message.sender)?.name.charAt(0)}
                        </Avatar>
                      )}
                      
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: message.sender === 'me' ? 'primary.main' : 'grey.100',
                          color: message.sender === 'me' ? 'white' : 'text.primary',
                          position: 'relative',
                        }}
                        onClick={(e) => handleMessageMenuOpen(e, message)}
                      >
                        {editMode && selectedMessage?.id === message.id ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField
                              fullWidth
                              multiline
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              variant="standard"
                              InputProps={{ 
                                style: { 
                                  color: message.sender === 'me' ? 'white' : 'inherit',
                                }
                              }}
                              autoFocus
                              sx={{ mb: 1 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Button 
                                size="small" 
                                onClick={handleEditCancel}
                                sx={{ 
                                  color: message.sender === 'me' ? 'rgba(255,255,255,0.7)' : 'inherit',
                                  '&:hover': {
                                    color: message.sender === 'me' ? 'white' : 'primary.main',
                                  }
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="small" 
                                onClick={handleEditSave}
                                variant="contained"
                                color={message.sender === 'me' ? 'info' : 'primary'}
                                disabled={!editText.trim()}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <>
                            <Typography variant="body1">{message.text}</Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                textAlign: message.sender === 'me' ? 'right' : 'left',
                                mt: 0.5,
                                color: message.sender === 'me' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                              }}
                            >
                              {formatMessageTime(message.timestamp)}
                            </Typography>
                          </>
                        )}
                        
                        {message.sender === 'me' && !editMode && (
                          <Tooltip title="Message options">
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                  color: 'white',
                                },
                                display: messageMenuAnchorEl && selectedMessage?.id === message.id ? 'block' : 'none',
                                '.MuiBox-root:hover &': {
                                  display: 'block',
                                },
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMessageMenuOpen(e, message);
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      
                      {message.sender === 'me' && (
                        <Avatar sx={{ ml: 1, width: 32, height: 32 }}>
                          {user?.name?.charAt(0) || 'U'}
                        </Avatar>
                      )}
                    </Box>
                  ))}
                  
                  {contactMessages.length === 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography color="textSecondary">No messages yet. Start a conversation!</Typography>
                    </Box>
                  )}
                </Box>
                
                {/* Message input */}
                <Box
                  sx={{
                    p: 2,
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    variant="outlined"
                    size="small"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    sx={{ ml: 1 }}
                  >
                    Send
                  </Button>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  p: 3,
                }}
              >
                <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.light' }}>
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  Select a Contact
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                  Choose a contact from the list to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Message actions menu */}
      <Menu
        anchorEl={messageMenuAnchorEl}
        open={Boolean(messageMenuAnchorEl)}
        onClose={handleMessageMenuClose}
      >
        <MenuItem onClick={handleEditStart}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this message? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Messages; 