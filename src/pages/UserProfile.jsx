import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';

const UserProfile = () => {
  const { userId } = useParams(); // Extract userId from route
  const [profile, setProfile] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUserId = '12345'; // Replace with actual logged-in user ID
  const API_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL; // Backend URL from .env

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/userProfile/${userId}`);
        setProfile(response.data);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      await axios.post(`${API_URL}/api/userProfile/${userId}/follow`, {
        currentUserId,
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
      {/* Profile Card */}
      <Card sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
        {/* User Info */}
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              marginRight: 2,
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box textAlign="center">
            <Typography variant="h4" color="primary" gutterBottom>
              {profile.username || profile.name}'s Profile
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {profile.email || 'No email provided'}
            </Typography>
          </Box>
        </Box>

        {/* Follow Button */}
        <Box textAlign="center" mb={2}>
          <Button
            variant="contained"
            color={isFollowing ? 'secondary' : 'primary'}
            startIcon={<FavoriteIcon />}
            onClick={handleFollowToggle}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        </Box>

        {/* User Stats */}
        <CardContent>
          <Typography variant="h6" color="textSecondary" align="center" mb={2}>
            Total Dishes: {profile.dishes?.length || 0}
          </Typography>
          <Typography variant="h6" color="textSecondary" align="center" mb={2}>
            Followers: {profile.followersCount || 0} | Following: {profile.followingCount || 0}
          </Typography>

          {/* Added Dishes Section */}
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Added Dishes:
            </Typography>
            {profile.dishes?.length > 0 ? (
              <Grid container spacing={2}>
                {profile.dishes.map((dish) => (
                  <Grid item xs={12} sm={6} md={4} key={dish.id}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {dish.recipeName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Cuisine: {dish.cuisineType}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Steps: {dish.steps}
                      </Typography>
                      <List dense>
                        {dish.ingredients?.map((ingredient, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={ingredient} />
                          </ListItem>
                        ))}
                      </List>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="textSecondary" mt={2}>
                No dishes added yet.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
