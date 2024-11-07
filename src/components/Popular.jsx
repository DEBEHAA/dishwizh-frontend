import { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import './Popular.css';
import { Skeleton, Typography } from "@mui/material";

const Popular = () => {
    const [popular, setPopular] = useState([]); // State to store popular recipes
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state

    const API_KEY = process.env.REACT_APP_API_KEY; // Use environment variable

    const getPopular = async () => {
        setLoading(true); // Start loading
        setError(''); // Reset error state
        try {
            const check = localStorage.getItem('popular');
            if (check) {
                const parsedData = JSON.parse(check);
                if (Array.isArray(parsedData)) {
                    setPopular(parsedData); // Use cached data
                } else {
                    console.warn("Invalid data in localStorage, refetching...");
                    localStorage.removeItem('popular');
                    await fetchPopularRecipes();
                }
            } else {
                await fetchPopularRecipes();
            }
        } catch (err) {
            console.error("Error reading from localStorage:", err);
            setError("Failed to load popular recipes. Please try again later.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const fetchPopularRecipes = async () => {
        try {
            const api = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=10`);
            const data = await api.json();
            if (data?.recipes && Array.isArray(data.recipes)) {
                localStorage.setItem('popular', JSON.stringify(data.recipes)); // Cache data
                setPopular(data.recipes); // Update state
            } else {
                throw new Error("Invalid API response format.");
            }
        } catch (err) {
            console.error("Error fetching popular recipes:", err);
            setError("Failed to fetch popular recipes. Please try again later.");
            setPopular([]); // Fallback to empty array to prevent rendering issues
        }
    };

    useEffect(() => {
        getPopular();
    }, []);

    if (loading) {
        // Display skeletons while loading
        return (
            <Splide options={{
                perPage: 4,
                pagination: false,
                gap: '2rem',
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
        // Display error message if something goes wrong
        return (
            <Typography color="error" align="center" sx={{ mt: 5 }}>
                {error}
            </Typography>
        );
    }

    if (popular.length === 0) {
        // Fallback message if no recipes are found
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No popular recipes found. Please try again later.
            </Typography>
        );
    }

    // Render popular recipes
    return (
        <div className="popular-container">
            <Typography variant="h4" align="center" gutterBottom>
                Popular Recipes
            </Typography>
            <Splide options={{
                perPage: 4,
                pagination: false,
                gap: '2rem',
            }}>
                {popular.map((recipe) => (
                    recipe && recipe.id ? (
                        <SplideSlide key={recipe.id}>
                            <RecipeCard data={recipe} />
                        </SplideSlide>
                    ) : null
                ))}
            </Splide>
        </div>
    );
};

export default Popular;
