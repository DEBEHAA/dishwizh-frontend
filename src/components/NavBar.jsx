import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const NavBar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false); 
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
   
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    
    const handleLogout = () => {
       
        setIsLoggedIn(false);
    };

    const handleLogin = () => {
        
        setIsLoggedIn(true);
    };

  
    const navLinks = (
        <>
            <Button component={Link} to="/*" sx={{ color: '#fff', marginRight: 2 }}>
                Home
            </Button>
            <Button component={Link} to="/favorites" sx={{ color: '#fff', marginRight: 2 }}>
                Favorites
            </Button>
            <Button component={Link} to="/addrecipe" sx={{ color: '#fff', marginRight: 2 }}>
                Add Recipe
            </Button>
            <Button component={Link} to="/userdetails" sx={{ color: '#fff', marginRight: 2 }}>
                User Details
            </Button>
            <Button component={Link} to="/" onClick={handleLogout} sx={{ color: '#fff', marginRight: 2 }}>
                        Logout
            </Button>
                
           
        </>
    );

    // List for Drawer (for mobile view)
    const drawerList = (
        <List sx={{ width: 250 }}>
            <ListItem button component={Link} to="/">
                <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/favorites">
                <ListItemText primary="Favorites" />
            </ListItem>
            <ListItem button component={Link} to="/user">
                <ListItemText primary="User Details" />
            </ListItem>
            
                <ListItem button onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                </ListItem>
          
        </List>
    );

    return (
        <>
            <AppBar position="static">
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Title / Logo */}
                    <Typography variant="h6" component="div">
                        DishWizh
                    </Typography>

                    {/* Show Drawer for Mobile, otherwise regular buttons */}
                    {isMobile ? (
                        <>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor="left"
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                            >
                                {drawerList}
                            </Drawer>
                        </>
                    ) : (
                        <div>
                            {navLinks}
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
};

export default NavBar;
