import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showApproved, setShowApproved] = useState(true);
  const [showPending, setShowPending] = useState(true);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/+$/, '');

  useEffect(() => {
    const fetchData = async () => {
      if (!backendURL) {
        console.error('Backend URL is not defined.');
        alert('Backend URL is missing. Please check your environment variables.');
        return;
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('User ID is missing. Please log in.');
        return;
      }

      try {
        const analyticsResponse = await axios.post(`${backendURL}/api/admin/analytics`, { userId });
        setAnalytics(analyticsResponse.data);

        const usersResponse = await axios.post(`${backendURL}/api/admin/users`, { userId });
        setUsers(usersResponse.data);

        const recipesResponse = await axios.post(`${backendURL}/api/admin/recipes`, { userId });
        setRecipes(recipesResponse.data);
        setFilteredRecipes(recipesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert(`Failed to load data. ${error.response?.data?.message || ''}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendURL]);

  const handleDeleteUser = async (userId) => {
    try {
      const adminId = localStorage.getItem('userId');
      await axios.delete(`${backendURL}/api/admin/users/${userId}`, { data: { userId: adminId } });
      setUsers(users.filter((user) => user._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };

  const handleApproveRecipe = async (recipeId) => {
    try {
      const adminId = localStorage.getItem('userId');
      await axios.put(`${backendURL}/api/admin/recipes/approve/${recipeId}`, { userId: adminId });
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe._id === recipeId ? { ...recipe, status: 'approved' } : recipe
        )
      );
      alert('Recipe approved successfully!');
    } catch (error) {
      console.error('Error approving recipe:', error);
      alert('Failed to approve recipe.');
    }
  };

  const handleDeclineRecipe = async (recipeId) => {
    try {
      const adminId = localStorage.getItem('userId');
      await axios.delete(`${backendURL}/api/admin/recipes/${recipeId}`, { data: { userId: adminId } });
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
      alert('Recipe declined successfully!');
    } catch (error) {
      console.error('Error declining recipe:', error);
      alert('Failed to decline recipe.');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleFilterChange = () => {
    const filtered = recipes.filter((recipe) => {
      if (showApproved && recipe.status === 'approved') return true;
      if (showPending && recipe.status === 'pending') return true;
      return false;
    });
    setFilteredRecipes(filtered);
  };

  useEffect(() => {
    handleFilterChange();
  }, [showApproved, showPending, recipes]);

  const customTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  });

  const barData = {
    labels: analytics.dailyNewUsers?.map((item) => item._id) || [],
    datasets: [
      {
        label: 'Daily New Users',
        data: analytics.dailyNewUsers?.map((item) => item.count) || [0],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const recipeStatusData = {
    labels: ['Approved', 'Pending'],
    datasets: [
      {
        data: [
          recipes.filter((recipe) => recipe.status === 'approved').length || 0,
          recipes.filter((recipe) => recipe.status === 'pending').length || 0,
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const userRecipeData = {
    labels: users.map((user) => user.name || 'Unknown User'),
    datasets: [
      {
        label: 'Number of Recipes',
        data: users.map((user) =>
          recipes.filter((recipe) => recipe.userId === user._id).length
        ),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Admin Dashboard
          </Typography>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        {/* Analytics Section */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{analytics.totalUsers || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Total Recipes</Typography>
              <Typography variant="h4">{analytics.totalRecipes || 0}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Daily User Registrations</Typography>
              <Bar data={barData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Recipe Status Distribution</Typography>
              <Pie data={recipeStatusData} />
            </Paper>
          </Grid>
        </Grid>

        {/* User Recipes Chart */}
        <Grid container spacing={3} sx={{ mt: 5 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6">Recipes by Users</Typography>
              <Bar data={userRecipeData} />
            </Paper>
          </Grid>
        </Grid>

        {/* Manage Recipes */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Manage Recipes
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showApproved}
                  onChange={(e) => setShowApproved(e.target.checked)}
                  color="primary"
                />
              }
              label="Show Approved"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPending}
                  onChange={(e) => setShowPending(e.target.checked)}
                  color="primary"
                />
              }
              label="Show Pending"
            />
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Details</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecipes.map((recipe) => (
                  <TableRow key={recipe._id}>
                    <TableCell>{recipe.recipeName}</TableCell>
                    <TableCell>{recipe.status}</TableCell>
                    <TableCell>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography><strong>Ingredients</strong></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{recipe.ingredients.join(', ')}</Typography>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography><strong>Steps</strong></Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{recipe.steps}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {recipe.status === 'pending' && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleApproveRecipe(recipe._id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleDeclineRecipe(recipe._id)}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        {recipe.status === 'approved' && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDeclineRecipe(recipe._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Manage Users */}
        <Box sx={{ mt: 5 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: 'lightblue' }}>
              <Typography variant="h6">Manage Users</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
