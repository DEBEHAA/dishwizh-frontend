import './Cuisine.css';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { Skeleton, Typography } from '@mui/material';

const Cuisine = () => {
    const [cuisine, setCuisine] = useState([]); // State for cuisine recipes
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state
    const params = useParams();

    const API_KEY = process.env.REACT_APP_API_KEY || '81bdc134fb73435fbb14311ed16cb557';// Use env variable with fallback

    const getCuisine = useCallback(async (name) => {
        setLoading(true);
        setError(''); // Reset error state
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&cuisine=${name}`
            );

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const recipeData = await response.json();

            console.log("API Response in Production:", recipeData);

            if (Array.isArray(recipeData.results)) {
                setCuisine(recipeData.results); // Set fetched recipes
            } else {
                throw new Error("Invalid API response format");
            }
        } catch (err) {
            console.error("Failed to fetch cuisine data:", err);
            setError('Failed to load recipes. Please try again later.');
            setCuisine([]); // Ensure empty array to prevent rendering issues
        } finally {
            setLoading(false);
        }
    }, [API_KEY]);

    useEffect(() => {
        if (params.type) {
            getCuisine(params.type);
        }
    }, [params.type, getCuisine]);

    // Show skeleton loader while fetching data
    if (loading) {
        return (
            <div className="cuisine-skeleton">
                {Array.from({ length: 10 }, (_, index) => (
                    <Skeleton
                        variant="rounded"
                        width={300}
                        height={200}
                        key={index}
                        animation="wave"
                        className="cuisine-skltn"
                    />
                ))}
            </div>
        );
    }

    // Show error message if API call fails
    if (error) {
        return (
            <Typography color="error" align="center" sx={{ mt: 5 }}>
                {error}
            </Typography>
        );
    }

    // Show fallback if no recipes are found
    if (cuisine.length === 0) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No recipes found for this cuisine.
            </Typography>
        );
    }

    // Render fetched cuisine recipes
    return (
        <div className="cuisine-container">
            {cuisine.map((data) => (
                <RecipeCard data={data} key={data.id} />
            ))}
        </div>
    );
};

export default Cuisine;
