import React, { useState, useEffect } from 'react';
import RecipeCard from "./RecipeCard";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Skeleton, Typography } from "@mui/material";
import axios from 'axios';

const MyRecipes = () => {
    const [myRecipes, setMyRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getMyRecipes = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            setError("User ID is missing. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL; // Use import.meta.env
            console.log("Backend URL:", BACKEND_URL); // Debugging

            const response = await axios.get(`${BACKEND_URL}/api/recipe/${userId}`);
            if (Array.isArray(response.data)) {
                setMyRecipes(response.data);
            } else {
                throw new Error("Invalid API response format.");
            }
        } catch (err) {
            console.error("Error fetching custom recipes:", err);
            setError("Failed to load your recipes. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyRecipes();
    }, []);

    if (loading) {
        return (
            <Splide options={{
                perPage: 4,
                pagination: false,
                gap: '2rem'
            }}>
                {[...Array(10)].map((_, index) => (
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

    if (!Array.isArray(myRecipes) || myRecipes.length === 0) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No custom recipes found. Add your favorite recipes to see them here!
            </Typography>
        );
    }

    return (
        <div className="my-recipes-container">
            <Typography variant="h4" align="center" gutterBottom>
                My Recipes
            </Typography>
            <Splide options={{
                perPage: 4,
                pagination: false,
                gap: '2rem',
            }}>
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
