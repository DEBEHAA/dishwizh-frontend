import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import img from './img.jpg';
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Save user data (including user ID) in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to the Sign In page or wherever you want
      navigate('/signin');
    } catch (err) {
      setError('Registration failed. Try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Left Side: Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: 4,
        }}
      >
        <Box>
          <Typography variant="h3" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            Welcome to DishWizh!
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: '#555' }}>
            Join us and explore a world of recipes, share your culinary creations, and discover
            your inner chef.
          </Typography>
        </Box>
      </Box>

      {/* Right Side: Signup Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2' }}>
           Join with DishWizh
          </Typography>
          {error && <Typography color="error" align="center">{error}</Typography>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#1976d2', marginTop: 2 }}
            >
              Sign Up
            </Button>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default Signup;
