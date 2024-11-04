import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  Link,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import img from './img.jpg';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, formData);

      // Assuming the backend returns an object with `userId`
      const userId = res.data.userId; // Make sure your backend is sending `userId` in the response

      // Store userId in localStorage
      localStorage.setItem('userId', userId);

      // Redirect to user details page
      navigate('/*');
    } catch (err) {
      setError('Login failed. Invalid credentials.');
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1976d2' }}>
          Sign In to DishWizh
        </Typography>
        
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            size="small"
            required
            fullWidth
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle fontSize="inherit" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            margin="normal"
          />

          <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
            <InputLabel size="small">Password</InputLabel>
            <OutlinedInput
              type={showPassword ? 'text' : 'password'}
              name="password"
              size="small"
              value={formData.password}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff fontSize="inherit" /> : <Visibility fontSize="inherit" />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ my: 2 }}
          >
            Sign In
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Link href="/forgot-password" variant="body2">
              Forgot password?
            </Link>
            <Link href="/register" variant="body2">
              Sign up
            </Link>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Signin;
