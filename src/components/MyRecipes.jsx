import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Skeleton, Typography, Box, Chip } from '@mui/material';
import axios from 'axios';

const MyRecipes = () => {
  const [myRecipes, setMyRecipes] = useState([]); // State for recipes
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  const getMyRecipes = async () => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    if (!userId) {
      setError('User ID is missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/+$/, ''); // Ensure no trailing slashes
      console.log('Fetching recipes from:', `${backendURL}/api/recipe/user/${userId}`); // Corrected variable

      const response = await axios.get(`${backendURL}/api/recipe/user/${userId}`); // Corrected variable
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
      <Splide options={{ perPage: 4, pagination: false, gap: '2rem' }}>
        {[...Array(4)].map((_, index) => (
          <SplideSlide key={index}>
            <Skeleton variant="rectangular" height={200} width={300} />
          </SplideSlide>
        ))}
      </Splide>
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
    <div className="my-recipes-container">
      <Typography variant="h4" align="center" gutterBottom>
        My Recipes
      </Typography>
      <Splide options={{ perPage: 4, pagination: false, gap: '2rem' }}>
        {myRecipes.map((recipe) => (
          recipe && recipe._id ? (
            <SplideSlide key={recipe._id}>
              <Box position="relative">
                {/* Recipe Card */}
                <RecipeCard data={{ ...recipe, isCustom: true }} />

                {/* Approval Status Badge */}
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
              </Box>
            </SplideSlide>
          ) : null
        ))}
      </Splide>
    </div>
  );
};

export default MyRecipes;
