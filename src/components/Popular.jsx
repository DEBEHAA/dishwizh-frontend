import { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Skeleton, Typography } from "@mui/material";

const Popular = () => {
    const [popular, setPopular] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_KEY = '81bdc134fb73435fbb14311ed16cb557';

    const fetchPopularRecipes = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=10`
            );

            if (!response.ok) {
                // Log and handle API errors
                const errorData = await response.json();
                console.error("API Error:", errorData);
                throw new Error(errorData.message || "Failed to fetch recipes.");
            }

            const data = await response.json();

            if (data?.recipes && Array.isArray(data.recipes)) {
                setPopular(data.recipes);
            } else {
                console.error("Unexpected API response format:", data);
                throw new Error("Invalid API response format.");
            }
        } catch (err) {
            console.error("Error fetching popular recipes:", err);
            setError(err.message || "Failed to load popular recipes. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopularRecipes();
    }, []);

    if (loading) {
        return (
            <Splide options={{ perPage: 4, pagination: false, gap: '2rem' }}>
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

    if (popular.length === 0) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No popular recipes found. Please try again later.
            </Typography>
        );
    }

    return (
        <div className="popular-container">
            <Typography variant="h4" align="center" gutterBottom>
                Popular Recipes
            </Typography>
            <Splide options={{ perPage: 4, pagination: false, gap: '2rem' }}>
                {popular.map((recipe) => (
                    <SplideSlide key={recipe.id}>
                        <RecipeCard data={recipe} />
                    </SplideSlide>
                ))}
            </Splide>
        </div>
    );
};

export default Popular;
