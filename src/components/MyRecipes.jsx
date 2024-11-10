import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import {
  Skeleton,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
} from '@mui/material';
import axios from 'axios';

const MyRecipes = () => {
  const [myRecipes, setMyRecipes] = useState([]); // State for recipes
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const navigate = useNavigate(); // For navigation

  // Fetch user's recipes
  const getMyRecipes = async () => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    if (!userId) {
      setError('User ID is missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/+$/, ''); // Ensure no trailing slashes
      console.log('Fetching recipes from:', `${backendURL}/api/recipe/user/${userId}`);

      const response = await axios.get(`${backendURL}/api/recipe/user/${userId}`);
      if (response.status === 200 && Array.isArray(response.data)) {
        console.log('Recipes fetched:', response.data); // Debug fetched recipes
        setMyRecipes(response.data);
      } else {
        throw new Error('Unexpected API response format.');
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.response?.data?.message || 'Failed to load your recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyRecipes();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={3} justifyContent="center">
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 5 }}>
        {error}
      </Typography>
    );
  }

  if (!myRecipes.length) {
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        No recipes found. Add your favorite recipes to see them here!
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Recipes
      </Typography>
      <Grid container spacing={3}>
        {myRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={recipe._id}>
            <Card sx={{ maxWidth: 345, position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}${recipe.imageUrl}`}
                alt={recipe.recipeName}
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {recipe.recipeName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cuisine: {recipe.cuisineType}
                </Typography>
              </CardContent>
              <Chip
                label={recipe.status === 'approved' ? 'Approved' : 'Pending'}
                color={recipe.status === 'approved' ? 'success' : 'warning'}
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  fontWeight: 'bold',
                }}
              />
              <Button
                size="small"
                variant="outlined"
                color="primary"
                sx={{ m: 2 }}
                onClick={() => navigate(`/recipes/${recipe._id}`)} // Navigate to RecipeDetails
              >
                View Details
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyRecipes;
