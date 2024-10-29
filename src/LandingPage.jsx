import React from 'react';
import { AppBar, Toolbar, Typography, Button, Grid, Card, CardContent, CardMedia, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import burger from "./assets/images/burger.jpg";
import hero from "./assets/images/hero.jpg";
import salad from "./assets/images/salad.jpg";
import pasta from "./assets/images/pasta.jpg";
import imageSection from "./assets/images/imagesection.jpg";
import dessert from "./assets/images/desserts.jpg";  

// Import slick-carousel CSS
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Slider settings
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true,
};

const LandingPage = () => {
  return (
    <>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            DishWizh
          </Typography>
          <div>
            <Button component={Link} to="/signin" sx={{ color: '#fff', marginRight: 2 }}>
              Sign In
            </Button>
            <Button component={Link} to="/signup" variant="contained" sx={{ backgroundColor: '#FFC107' }}>
              Sign Up
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Hero Section with Image Carousel */}
      <Box sx={{ position: 'relative' }}>
        <Slider {...settings}>
          {/* Slide 1 */}
          <Box
            sx={{
              height: '80vh',
              backgroundImage: `url(${hero})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              textAlign: 'center',
              padding: 4,
            }}
          >
            <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Welcome to DishWizh!
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 4 }}>
              Discover a world of colorful and mouth-watering recipes!
            </Typography>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              sx={{ backgroundColor: '#FFC107', fontSize: '1.2rem', padding: '10px 30px' }}
            >
              Join Now
            </Button>
          </Box>

          {/* Slide 2 */}
          <Box
            sx={{
              height: '80vh',
              backgroundImage: `url(${salad})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              textAlign: 'center',
              padding: 4,
            }}
          >
            <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Fresh Fruit Salads
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 4 }}>
              Indulge in healthy and colorful salads for any season!
            </Typography>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              sx={{ backgroundColor: '#FFC107', fontSize: '1.2rem', padding: '10px 30px' }}
            >
              Try Now
            </Button>
          </Box>

          {/* Slide 3 */}
          <Box
            sx={{
              height: '80vh',
              backgroundImage: `url(${burger})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              textAlign: 'center',
              padding: 4,
            }}
          >
            <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Juicy Burgers
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 4 }}>
              Dive into the best burger recipes you can make at home.
            </Typography>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              sx={{ backgroundColor: '#FFC107', fontSize: '1.2rem', padding: '10px 30px' }}
            >
              Learn More
            </Button>
          </Box>

          {/* Slide 4 */}
          <Box
            sx={{
              height: '80vh',
              backgroundImage: `url(${pasta})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              textAlign: 'center',
              padding: 4,
            }}
          >
            <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Delicious Pasta
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 4 }}>
              Try our vibrant and flavorful pasta recipes that will leave your taste buds dancing!
            </Typography>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              sx={{ backgroundColor: '#FFC107', fontSize: '1.2rem', padding: '10px 30px' }}
            >
              Join Now
            </Button>
          </Box>
        </Slider>
      </Box>

      {/* Image Card Section */}
      <Container maxWidth="lg" sx={{ marginTop: 8, marginBottom: 8 }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', marginBottom: 5, color: '#1976d2' }}>
          Featured Dishes
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={salad}
                alt="Fresh Salad"
              />
              <CardContent>
                <Typography variant="h5" sx={{ color: '#1976d2' }}>
                  Fresh Salad
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A refreshing and colorful mix of fresh vegetables and fruits.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={dessert}
                alt="Dessert"
              />
              <CardContent>
                <Typography variant="h5" sx={{ color: '#FFC107' }}>
                  Delicious Dessert
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Indulge in our heavenly sweet and creamy desserts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={pasta}
                alt="Delicious Pasta"
              />
              <CardContent>
                <Typography variant="h5" sx={{ color: '#8BC34A' }}>
                  Tasty Pasta
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try our tasty and vibrant pasta dishes, perfect for dinner!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Split Section with Image and Content */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, marginBottom: 8 }}>
        {/* Image Section */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${imageSection})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '400px',
          }}
        ></Box>

        {/* Content Section */}
        <Box sx={{ flex: 1, padding: 4 }}>
          <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 'bold', marginBottom: 3 }}>
            Our Story
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 3 }}>
            At DishWizh, we believe in creating delightful recipes that not only taste amazing but are also easy to make.
            Whether you're a professional chef or a home cook, we offer a variety of dishes to suit your style.
          </Typography>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            sx={{ backgroundColor: '#FFC107', fontSize: '1.2rem', padding: '10px 30px' }}
          >
            Join the Journey
          </Button>
        </Box>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ backgroundColor: '#1976d2', padding: 4, color: '#fff', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
          Ready to Explore More?
        </Typography>
        <Button
          component={Link}
          to="/signup"
          variant="contained"
          sx={{ backgroundColor: '#FFC107', marginRight: 2, fontSize: '1.2rem', padding: '10px 30px' }}
        >
          Sign Up Now
        </Button>
        <Button
          component={Link}
          to="/signin"
          variant="outlined"
          sx={{ color: '#fff', borderColor: '#fff', fontSize: '1.2rem', padding: '10px 30px' }}
        >
          Sign In
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#333', color: '#fff', padding: 4, textAlign: 'center' }}>
        <Typography variant="body1">
          &copy; 2024 DishWizh. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default LandingPage;
