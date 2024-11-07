import './Cuisine.css';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { API_KEY } from '../assets/API_KEY';
import { Skeleton, Typography } from '@mui/material';

const Cuisine = () => {
    const [cuisine, setCuisine] = useState([]); // State to store cuisine recipes
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state
    const params = useParams();

    const getCuisine = useCallback(async (name) => {
        setLoading(true);
        setError(''); // Reset error state before fetching
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&cuisine=${name}`
            );
            const recipeData = await response.json();
            console.log("API Response:", recipeData);

            if (recipeData.results && Array.isArray(recipeData.results)) {
                setCuisine(recipeData.results); // Set the fetched recipes
            } else {
                throw new Error("Invalid API response format.");
            }
        } catch (err) {
            console.error("Failed to fetch cuisine data:", err);
            setError('Failed to load cuisine recipes. Please try again later.');
            setCuisine([]); // Ensure cuisine is set to an empty array
        } finally {
            setLoading(false); // Stop loader
        }
    }, []);

    useEffect(() => {
        if (params.type) {
            getCuisine(params.type);
        }
    }, [params.type, getCuisine]);

    // Display loading skeletons while fetching data
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

    // Display error message if an error occurs
    if (error) {
        return (
            <Typography color="error" align="center" sx={{ mt: 5 }}>
                {error}
            </Typography>
        );
    }

    // Fallback if no recipes are found
    if (cuisine.length === 0) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No recipes found for this cuisine.
            </Typography>
        );
    }

    // Display fetched recipes
    return (
        <div className="cuisine-container">
            {cuisine.map((data) => (
                <RecipeCard data={data} key={data.id} />
            ))}
        </div>
    );
};

export default Cuisine;
