import React, { useState } from 'react';
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
  Avatar,
  TextField,
  Button,
  Divider,
  IconButton,
  Badge,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

// Dummy data for displaying messages
const DUMMY_CONTACTS = [
  { id: 1, name: 'John Smith', role: 'student', unread: 3, lastMessage: 'Hello, I have a question about the assignment...' },
  { id: 2, name: 'Jane Doe', role: 'teacher', unread: 0, lastMessage: 'Thank you for submitting your work' },
  { id: 3, name: 'Michael Johnson', role: 'student', unread: 1, lastMessage: 'When is the next class?' },
  { id: 4, name: 'Academic Department', role: 'admin', unread: 0, lastMessage: 'Notice regarding semester exams' },
  { id: 5, name: 'Library', role: 'admin', unread: 0, lastMessage: 'Your book return date is approaching' },
];

const DUMMY_MESSAGES = [
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
  
  const filteredContacts = DUMMY_CONTACTS.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleContactSelect = (contactId) => {
    setSelectedContact(contactId);
  };
  
  const handleSendMessage = () => {
    if (messageText.trim() && selectedContact) {
      // Here you would dispatch an action to send the message
      console.log(`Sending message to contact ${selectedContact}: ${messageText}`);
      setMessageText('');
    }
  };
  
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
                  {DUMMY_MESSAGES.map(message => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                        mb: 2,
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
                        }}
                      >
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
                      </Box>
                      
                      {message.sender === 'me' && (
                        <Avatar sx={{ ml: 1, width: 32, height: 32 }}>
                          {user?.name?.charAt(0) || 'U'}
                        </Avatar>
                      )}
                    </Box>
                  ))}
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
                }}
              >
                <PersonIcon sx={{ fontSize: 80, color: 'action.disabled', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  Select a contact to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages; 