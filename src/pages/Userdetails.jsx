import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import './UserDetails.css';

const UserDetails = () => {
  const userId = localStorage.getItem('userId');
  const [userData, setUserData] = useState({
    phone: '',
    address: '',
    postalCode: '',
    age: '',
    gender: '',
    professionalChef: false,
    experience: '',
  });
  const [message, setMessage] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setMessage('User ID not found. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/chef/${userId}`);
        if (response.data) {
          setUserData(response.data);
          setIsNewUser(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setIsNewUser(true);
        } else {
          console.error('Error fetching user data:', error);
          setMessage('Error fetching user details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage('User ID is missing. Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
      setLoading(true);
      if (isNewUser) {
        await axios.post(`${backendUrl}/api/chef/${userId}`, userData);
        setMessage('User details added successfully!');
      } else {
        await axios.put(`${backendUrl}/api/chef/${userId}`, userData);
        setMessage('User details updated successfully!');
      }
      setIsNewUser(false);
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        setMessage('Network error. Please check your internet connection.');
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="user-details-container" sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Details
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              variant="outlined"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              variant="outlined"
              name="address"
              value={userData.address}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Postal Code"
              variant="outlined"
              name="postalCode"
              value={userData.postalCode}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Age"
              variant="outlined"
              type="number"
              name="age"
              value={userData.age}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
              >
                <MenuItem value=""><em>Select Gender</em></MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cooking Experience (in years)"
              variant="outlined"
              type="number"
              name="experience"
              value={userData.experience}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={userData.professionalChef}
                  onChange={handleInputChange}
                  name="professionalChef"
                />
              }
              label="Are you a professional chef?"
            />
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={loading}>
          {loading ? 'Submitting...' : isNewUser ? 'Add Details' : 'Update Details'}
        </Button>
      </form>

      {message && (
        <Typography color={message.includes('success') ? 'primary' : 'error'} sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default UserDetails;
