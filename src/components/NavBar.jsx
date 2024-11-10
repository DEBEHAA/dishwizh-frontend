import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  InputAdornment,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserId = localStorage.getItem('userId');
    setIsLoggedIn(!!loggedInUserId);
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      navigate(`/users?search=${search}`);
      setSearch('');
    }
  };

  const navLinks = (
    <>
      {/* Admin Panel is now visible to all users */}
      <Button component={Link} to="/admin" sx={{ color: '#fff', marginRight: 2 }}>
        Admin Panel
      </Button>
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
      <Button component={Link} to="/users" sx={{ color: '#fff', marginRight: 2 }}>
        Find Chef
      </Button>
      {isLoggedIn ? (
        <Button component={Link} to="/" onClick={handleLogout} sx={{ color: '#fff', marginRight: 2 }}>
          Logout
        </Button>
      ) : (
        <Button component={Link} to="/login" sx={{ color: '#fff', marginRight: 2 }}>
          Login
        </Button>
      )}
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          DishWizh
        </Typography>

        {!isMobile && (
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ marginRight: 3, backgroundColor: '#fff', borderRadius: 1 }}
          />
        )}

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
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
              <List sx={{ width: 250 }}>
                <ListItem button component={Link} to="/admin">
                  <ListItemText primary="Admin Panel" />
                </ListItem>
                <ListItem button component={Link} to="/">
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/favorites">
                  <ListItemText primary="Favorites" />
                </ListItem>
                <ListItem button component={Link} to="/addrecipe">
                  <ListItemText primary="Add Recipe" />
                </ListItem>
                <ListItem button component={Link} to="/userdetails">
                  <ListItemText primary="User Details" />
                </ListItem>
                <ListItem button component={Link} to="/users">
                  <ListItemText primary="Find Chef" />
                </ListItem>
                {isLoggedIn ? (
                  <ListItem button onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                  </ListItem>
                ) : (
                  <ListItem button component={Link} to="/login">
                    <ListItemText primary="Login" />
                  </ListItem>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          <div>{navLinks}</div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
