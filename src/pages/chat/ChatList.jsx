import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';

const ChatList = ({ onSelectUser }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch chat list from backend
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/chats`);
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <List>
      {chats.map((chat) => (
        <ListItem button key={chat.userId} onClick={() => onSelectUser(chat.userId)}>
          <ListItemAvatar>
            <Avatar>{chat.name.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={chat.name}
            secondary={
              <>
                <Typography variant="body2" color="textSecondary">
                  {chat.lastMessage}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(chat.timestamp).toLocaleString()}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ChatList;
