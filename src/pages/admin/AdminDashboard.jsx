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
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState({});
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    // Correctly access environment variables in Vite
    const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_URL?.replace(/\/+$/, '');

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const analyticsResponse = await axios.get(`${backendURL}/api/admin/analytics`);
                setAnalytics(analyticsResponse.data);

                const usersResponse = await axios.get(`${backendURL}/api/admin/users`);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [backendURL]);

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${backendURL}/api/admin/users/${userId}`);
            setUsers(users.filter((user) => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

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

    const pieData = {
        labels: ['Total Users', 'Total Recipes'],
        datasets: [
            {
                data: [analytics.totalUsers, analytics.totalRecipes],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                hoverOffset: 4,
            },
        ],
    };

    const pieOptions = {
        plugins: {
            legend: {
                position: 'right',
            },
        },
    };

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
                            <Typography variant="h6">Overall Distribution</Typography>
                            <Pie data={pieData} options={pieOptions} />
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
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => alert(`Edit user: ${user.name}`)}
                                                >
                                                    Edit
                                                </Button>
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
