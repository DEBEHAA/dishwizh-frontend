import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_URL);

const Chat = ({ userId, otherUserId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const room = `${userId}-${otherUserId}`;
    socket.emit('joinRoom', room);

    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userId, otherUserId]);

  const sendMessage = () => {
    if (message.trim()) {
      const chatMessage = {
        sender: userId,
        receiver: otherUserId,
        message,
        room: `${userId}-${otherUserId}`,
      };
      socket.emit('sendMessage', chatMessage);
      setMessages((prev) => [...prev, chatMessage]);
      setMessage('');
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Messages List */}
      <Box flexGrow={1} overflow="auto">
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    align={msg.sender === userId ? 'right' : 'left'}
                  >
                    {msg.message}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    align={msg.sender === userId ? 'right' : 'left'}
                    color="textSecondary"
                  >
                    {msg.sender === userId ? 'You' : 'Other'}
                  </Typography>
                }
                style={{
                  textAlign: msg.sender === userId ? 'right' : 'left',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Message Input */}
      <Box display="flex" padding={1} borderTop="1px solid #ccc">
        <TextField
          variant="outlined"
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          style={{ marginLeft: '8px' }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
