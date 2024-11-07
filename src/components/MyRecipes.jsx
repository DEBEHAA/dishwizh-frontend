import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Skeleton, Typography } from '@mui/material';
import axios from 'axios';

const MyRecipes = () => {
    const [myRecipes, setMyRecipes] = useState([]); // State for recipes
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state

    const getMyRecipes = async () => {
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        if (!userId) {
            setError('User ID is missing. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
            console.log('Backend URL:', BACKEND_URL); // Debugging the URL

            const response = await axios.get(`${BACKEND_URL}/api/recipe/user/${userId}`);
            if (response.data && Array.isArray(response.data)) {
                setMyRecipes(response.data); // Update state with recipes
            } else {
                throw new Error('Invalid API response format.');
            }
        } catch (err) {
            console.error('Error fetching recipes:', err);
            setError('Failed to load your recipes. Please try again later.');
        } finally {
            setLoading(false); // Stop the loading spinner
        }
    };

    useEffect(() => {
        getMyRecipes();
    }, []);

    if (loading) {
        return (
            <Splide options={{ perPage: 4, pagination: false, gap: '2rem' }}>
                {[...Array(4)].map((_, index) => (
                    <SplideSlide key={index}>
                        <Skeleton height={200} width={300} />
                    </SplideSlide>
                ))}
            </Splide>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" sx={{ mt: 5 }}>
                {error}
            </Typography>
        );
    }

    if (!myRecipes.length) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No recipes found. Add your favorite recipes to see them here!
            </Typography>
        );
    }

    return (
        <div className="my-recipes-container">
            <Typography variant="h4" align="center" gutterBottom>
                My Recipes
            </Typography>
            <Splide options={{ perPage: 4, pagination: false, gap: '2rem' }}>
                {myRecipes.map((recipe) => (
                    recipe && recipe._id ? (
                        <SplideSlide key={recipe._id}>
                            <RecipeCard data={{ ...recipe, isCustom: true }} />
                        </SplideSlide>
                    ) : null
                ))}
            </Splide>
        </div>
    );
};

export default MyRecipes;
