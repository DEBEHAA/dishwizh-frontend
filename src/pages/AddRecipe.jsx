import React, { useState } from 'react';
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
} from '@mui/material';

const AddRecipe = () => {
  const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
  const [formData, setFormData] = useState({
    recipeName: '',
    cuisineType: '',
    ingredients: '',
    steps: ''
  });
  const [image, setImage] = useState(null); // State for image file
  const [message, setMessage] = useState('');

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage('User ID is missing. Please log in again.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('userId', userId); // Include userId in form data
    formDataToSend.append('recipeName', formData.recipeName);
    formDataToSend.append('cuisineType', formData.cuisineType);
    formDataToSend.append('ingredients', formData.ingredients);
    formDataToSend.append('steps', formData.steps);
    if (image) {
      formDataToSend.append('image', image); // Append image file if selected
    }

    try {
      const response = await axios.post('http://localhost:5000/api/recipe', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage(response.data.message);
      setFormData({
        recipeName: '',
        cuisineType: '',
        ingredients: '',
        steps: ''
      });
      setImage(null);
    } catch (error) {
      console.error('Error adding recipe:', error);
      setMessage('Failed to add recipe.');
    }
  };

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
            <Button
              variant="contained"
              component="label"
              fullWidth
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
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
        >
          Add Recipe
        </Button>
      </form>
    </Box>
  );
};

export default AddRecipe;
