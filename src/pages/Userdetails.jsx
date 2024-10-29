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
} from '@mui/material';
import './UserDetails.css';

const UserDetails = () => {
  // Retrieve userId from localStorage
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setMessage('User ID not found. Please sign in again.');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/chef/${userId}`);
        if (response.data) {
          setUserData(response.data); // Populate form with existing data
          setIsNewUser(false); // Set to update mode
        } else {
          setIsNewUser(true); // Set to create mode
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setIsNewUser(true);
        } else {
          console.error('Error fetching user data:', error);
          setMessage('Error fetching user details. Please try again later.');
        }
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
      setMessage('User ID is missing. Please sign in again.');
      return;
    }

    try {
      if (isNewUser) {
        await axios.post(`http://localhost:5000/api/chef/${userId}`, userData);
        setMessage('User details added successfully!');
      } else {
        await axios.put(`http://localhost:5000/api/chef/${userId}`, userData);
        setMessage('User details updated successfully!');
      }
      setIsNewUser(false);
    } catch (error) {
      console.error('Error updating user details:', error);
      setMessage('Failed to update user details.');
    }
  };

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

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          {isNewUser ? 'Add Details' : 'Update Details'}
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
