import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import ChatList from './ChatList';
import Chat from './Chat';

const ChatPage = ({ userId }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (otherUserId) => {
    setSelectedUser(otherUserId);
  };

  return (
    <Grid container style={{ height: '100vh' }}>
      {/* Chat List */}
      <Grid item xs={4} style={{ borderRight: '1px solid #ccc' }}>
        <Box height="100%" overflow="auto">
          <ChatList onSelectUser={handleUserSelect} />
        </Box>
      </Grid>

      {/* Chat Window */}
      <Grid item xs={8}>
        <Box height="100%" overflow="auto" padding={2}>
          {selectedUser ? (
            <Chat userId={userId} otherUserId={selectedUser} />
          ) : (
            <Typography variant="h6" color="textSecondary" align="center">
              Select a user to start chatting.
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ChatPage;
