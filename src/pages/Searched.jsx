import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import './Searched.css';
import { Skeleton, Typography } from "@mui/material";

const Searched = () => {
    const [searchedRecipes, setSearchedRecipes] = useState([]); // State for searched recipes
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state
    const params = useParams();

    const API_KEY = process.env.REACT_APP_API_KEY || '81bdc134fb73435fbb14311ed16cb557'; // Use environment variable for API key

    const getSearched = async (name) => {
        setLoading(true); // Show loader
        setError(''); // Reset error state
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${name}`
            );

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const recipes = await response.json();
            console.log("API Response:", recipes); // Debug API response

            if (Array.isArray(recipes.results)) {
                setSearchedRecipes(recipes.results); // Safely set fetched recipes
            } else {
                throw new Error("Invalid API response format.");
            }
        } catch (err) {
            console.error("Failed to fetch searched recipes:", err);
            setError('Failed to load recipes. Please try again later.');
            setSearchedRecipes([]); // Ensure empty array to prevent rendering issues
        } finally {
            setLoading(false); // Stop loader
        }
    };

    useEffect(() => {
        if (params.search) {
            getSearched(params.search);
        }
    }, [params.search]);

    if (loading) {
        // Render skeleton loaders while data is being fetched
        return (
            <div className="cuisine-skeleton">
                {[...Array(10)].map((_, index) => (
                    <Skeleton
                        key={index}
                        variant="rounded"
                        width={300}
                        height={200}
                        animation="wave"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        // Render error message
        return (
            <Typography color="error" align="center" sx={{ mt: 5 }}>
                {error}
            </Typography>
        );
    }

    if (searchedRecipes.length === 0) {
        // Render fallback message if no recipes are found
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No recipes found for "{params.search}".
            </Typography>
        );
    }

    // Render fetched recipes
    return (
        <div className="searched-container">
            <Typography variant="h4" align="center" gutterBottom>
                Results for "{params.search}"
            </Typography>
            {searchedRecipes.map((data) => (
                <RecipeCard data={data} key={data.id} />
            ))}
        </div>
    );
};

export default Searched;
