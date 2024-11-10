import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';

const UserList = () => {
  const [users, setUsers] = useState([]); // List of chefs
  const [search, setSearch] = useState(''); // Search input
  const [loading, setLoading] = useState(false); // Loading indicator
  const [currentUserId] = useState('12345'); // Replace with the logged-in user ID

  // Get backend URL from environment variables
  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/+$/, '');

  useEffect(() => {
    // Fetch all chefs on mount
    fetchUsers();
  }, []);

  const fetchUsers = async (query = '') => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/chef/all?search=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data); // Set the users data
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    fetchUsers(query); // Fetch filtered users based on the search input
  };

  const handleFollowToggle = async (userId, isFollowing, index) => {
    try {
      const response = await fetch(`${API_URL}/api/chef/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserId }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle follow status');
      }

      // Update the state locally
      const updatedUsers = [...users];
      updatedUsers[index].isFollowing = !isFollowing;
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Make Your Team with Our Chefs
      </Typography>
      <TextField
        fullWidth
        label="Search by username, email, or phone"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />
      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {users.length > 0 ? (
            users.map((user, index) => (
              <Grid item xs={12} sm={6} key={user._id}>
                <Card
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {user.userId.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Email: {user.userId.email}
                    </Typography>
                    {user.phone && (
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Phone: {user.phone}
                      </Typography>
                    )}
                    <Button
                      variant="text"
                      component={Link}
                      to={`/user/${user.userId._id}`}
                      sx={{ mt: 2 }}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                  <Button
                    variant="contained"
                    color={user.isFollowing ? 'secondary' : 'primary'}
                    onClick={() => handleFollowToggle(user.userId._id, user.isFollowing, index)}
                  >
                    {user.isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              No users found.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default UserList;
