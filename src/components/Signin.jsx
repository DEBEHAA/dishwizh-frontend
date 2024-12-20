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

  const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/+$/, '');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Backend URL:", backendURL); // Debugging the backend URL

    try {
      const res = await axios.post(`${backendURL}/api/auth/login`, formData);

      // Assuming the backend returns `userId` and `isAdmin`
      const { userId, isAdmin } = res.data;

      // Store userId and isAdmin status in localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('isAdmin', isAdmin);

      // Redirect based on admin status
      if (isAdmin) {
        navigate('/admin'); // Redirect to Admin Panel
      } else {
        navigate('/*'); // Redirect to Home
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your internet connection or try again later.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
      }
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
