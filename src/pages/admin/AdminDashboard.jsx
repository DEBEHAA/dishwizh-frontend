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
    IconButton,
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState({});
    const [users, setUsers] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/+$/, '');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch analytics data
                const analyticsResponse = await axios.post(`${backendURL}/api/admin/analytics`, {
                    userId: localStorage.getItem('userId'),
                });
                setAnalytics(analyticsResponse.data);

                // Fetch user data
                const usersResponse = await axios.post(`${backendURL}/api/admin/users`, {
                    userId: localStorage.getItem('userId'),
                });
                setUsers(usersResponse.data);

                // Fetch recipe data
                const recipesResponse = await axios.post(`${backendURL}/api/admin/recipes`, {
                    userId: localStorage.getItem('userId'),
                });
                setRecipes(recipesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to load data. Ensure you have admin privileges.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [backendURL]);

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${backendURL}/api/admin/users/${userId}`, {
                data: { userId: localStorage.getItem('userId') },
            });
            setUsers(users.filter((user) => user._id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
        }
    };

    const handleApproveRecipe = async (recipeId) => {
        try {
            await axios.put(`${backendURL}/api/admin/recipes/approve/${recipeId}`, {
                userId: localStorage.getItem('userId'),
            });
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
            await axios.delete(`${backendURL}/api/admin/recipes/${recipeId}`, {
                data: { userId: localStorage.getItem('userId') },
            });
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
                data: analytics.dailyNewUsers?.map((item) => item.count) || [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    const recipeStatusData = {
        labels: ['Approved', 'Pending'],
        datasets: [
            {
                data: [
                    recipes.filter((recipe) => recipe.status === 'approved').length,
                    recipes.filter((recipe) => recipe.status === 'pending').length,
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6">Loading...</Typography>
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

                {/* Summary Cards */}
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

                {/* User List */}
                <Box sx={{ mt: 5 }}>
                    <Typography variant="h5" gutterBottom>
                        Manage Users
                    </Typography>
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
                                            <Box display="flex" gap={1}>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Recipe Management */}
                <Box sx={{ mt: 5 }}>
                    <Typography variant="h5" gutterBottom>
                        Manage Recipes
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recipes.map((recipe) => (
                                    <TableRow key={recipe._id}>
                                        <TableCell>{recipe.recipeName}</TableCell>
                                        <TableCell>{recipe.status}</TableCell>
                                        <TableCell>
                                            <Box display="flex" gap={1}>
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
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default AdminDashboard;
