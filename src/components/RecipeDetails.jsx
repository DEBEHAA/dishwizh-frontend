import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Card,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const RecipeDetails = () => {
  const { id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/+$/, '');
        const response = await axios.get(`${backendURL}/api/recipe/${id}`);
        if (response.status === 200) {
          setRecipe(response.data);
        } else {
          throw new Error('Failed to fetch recipe details.');
        }
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        setError(err.response?.data?.message || 'Failed to fetch recipe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 5 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 5, maxWidth: '1200px', margin: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: '#f9f9f9' }}>
        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}${recipe.imageUrl}`}
                alt={recipe.recipeName}
                sx={{
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: '2px solid #1976d2',
                }}
              />
            </Card>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={8}>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 'bold', color: '#1976d2', textTransform: 'uppercase' }}
              >
                {recipe.recipeName}
              </Typography>
              <Chip
                label={recipe.status === 'approved' ? 'Approved' : 'Pending'}
                color={recipe.status === 'approved' ? 'success' : 'warning'}
                sx={{ mb: 2, fontWeight: 'bold', fontSize: '0.9rem' }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                Cuisine Type:
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
                {recipe.cuisineType}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Ingredients and Steps Section */}
        <Box sx={{ mt: 4 }}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#e3f2fd', // Light blue background for Ingredients
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#bbdefb', // Darker blue on hover
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Ingredients
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {ingredient}
                    </Typography>
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#ffebee', // Light red background for Steps
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#ffcdd2', // Darker red on hover
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                Steps
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {recipe.steps}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>
    </Box>
  );
};

export default RecipeDetails;
