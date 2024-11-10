import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';

const AddRecipe = () => {
  const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
  const [formData, setFormData] = useState({
    recipeName: '',
    cuisineType: '',
    ingredients: '',
    steps: '',
  });
  const [image, setImage] = useState(null); // State for image file
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [pendingRecipes, setPendingRecipes] = useState([]); // State for pending recipes
  const [verifiedRecipes, setVerifiedRecipes] = useState([]); // State for verified recipes
  const [fetching, setFetching] = useState(true); // Loading state for fetching recipes

  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/$/, ''); // Ensure no trailing slash

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image file changes
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setMessage('Image size should not exceed 5 MB.');
      return;
    }
    if (file && !file.type.startsWith('image/')) {
      setMessage('Only image files are allowed.');
      return;
    }
    setImage(file);
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage('User ID is missing. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }

    if (!backendUrl) {
      setMessage('Server configuration error. Please try again later.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('userId', userId);
    formDataToSend.append('recipeName', formData.recipeName);
    formDataToSend.append('cuisineType', formData.cuisineType);
    formDataToSend.append('ingredients', formData.ingredients);
    formDataToSend.append('steps', formData.steps);
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/recipe`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMessage(response.data.message || 'Recipe added successfully!');
      setFormData({
        recipeName: '',
        cuisineType: '',
        ingredients: '',
        steps: '',
      });
      setImage(null);

      // Refresh recipes after adding
      fetchRecipes();
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.message || 'Failed to add recipe.'}`);
      } else if (error.request) {
        setMessage('Network error. Please check your connection.');
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Error adding recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending and verified recipes
  const fetchRecipes = async () => {
    try {
      setFetching(true);
      const pendingResponse = await axios.get(`${backendUrl}/api/recipe/user/${userId}?status=pending`);
      const verifiedResponse = await axios.get(`${backendUrl}/api/recipe/user/${userId}?status=approved`);

      setPendingRecipes(pendingResponse.data || []);
      setVerifiedRecipes(verifiedResponse.data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setMessage('Failed to fetch recipes.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Add New Recipe
      </Typography>
      {message && (
        <Typography color={message.includes('success') ? 'primary' : 'error'} align="center" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Recipe Name"
              name="recipeName"
              variant="outlined"
              value={formData.recipeName}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Cuisine Type</InputLabel>
              <Select
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleInputChange}
                label="Cuisine Type"
              >
                <MenuItem value="Italian">Italian</MenuItem>
                <MenuItem value="Mexican">Mexican</MenuItem>
                <MenuItem value="Indian">Indian</MenuItem>
                <MenuItem value="Chinese">Chinese</MenuItem>
                <MenuItem value="American">American</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ingredients (separated by commas)"
              name="ingredients"
              variant="outlined"
              value={formData.ingredients}
              onChange={handleInputChange}
              required
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Steps to Make"
              name="steps"
              variant="outlined"
              value={formData.steps}
              onChange={handleInputChange}
              required
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
            {image && <Typography align="center" sx={{ mt: 1 }}>{image.name}</Typography>}
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Add Recipe'}
        </Button>
      </form>

      {/* Pending Recipes Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Added Recipes
        </Typography>
        {fetching ? (
          <CircularProgress />
        ) : pendingRecipes.length > 0 ? (
          <Paper sx={{ p: 2 }}>
            <List>
              {pendingRecipes.map((recipe) => (
                <ListItem key={recipe._id}>
                  <ListItemText
                    primary={recipe.recipeName}
                    secondary={`Cuisine: ${recipe.cuisineType}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          <Typography>No pending recipes.</Typography>
        )}
      </Box>

      {/* Verified Recipes Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Verified Recipes
        </Typography>
        {fetching ? (
          <CircularProgress />
        ) : verifiedRecipes.length > 0 ? (
          <Paper sx={{ p: 2 }}>
            <List>
              {verifiedRecipes.map((recipe) => (
                <ListItem key={recipe._id}>
                  <ListItemText
                    primary={recipe.recipeName}
                    secondary={`Cuisine: ${recipe.cuisineType}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          <Typography>No verified recipes.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default AddRecipe;
