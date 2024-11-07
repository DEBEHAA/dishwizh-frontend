import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Skeleton, Typography } from "@mui/material";

const Veggie = () => {
    const API_KEY = process.env.REACT_APP_API_KEY || '81bdc134fb73435fbb14311ed16cb557'; // Use environment variable for API key

    const [veggie, setVeggie] = useState([]); // State to store recipes
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state

    const fetchVeggieData = async () => {
        try {
            const api = await fetch(
                `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=10&tags=vegetarian`
            );
            const data = await api.json();

            console.log("API Response:", data); // Debug the API response

            if (data?.recipes && Array.isArray(data.recipes)) {
                localStorage.setItem('veggie', JSON.stringify(data.recipes)); // Cache data in localStorage
                setVeggie(data.recipes); // Set recipes to state
            } else {
                throw new Error("Invalid API response format.");
            }
        } catch (err) {
            console.error("Error fetching veggie data:", err);
            setError("Failed to load vegetarian recipes. Please try again later.");
            setVeggie([]); // Ensure state is reset to prevent rendering issues
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    const getVeggie = async () => {
        const cachedVeggie = localStorage.getItem('veggie'); // Retrieve from localStorage

        if (cachedVeggie) {
            try {
                const parsedVeggie = JSON.parse(cachedVeggie); // Parse stored data
                if (Array.isArray(parsedVeggie)) {
                    setVeggie(parsedVeggie); // Use cached data if valid
                } else {
                    console.warn("Invalid localStorage data. Fetching fresh data...");
                    localStorage.removeItem('veggie'); // Clear corrupted data
                    await fetchVeggieData(); // Fetch fresh data
                }
            } catch (err) {
                console.error("Error parsing localStorage data:", err);
                localStorage.removeItem('veggie'); // Clear corrupted data
                await fetchVeggieData(); // Fetch fresh data
            }
        } else {
            await fetchVeggieData(); // Fetch fresh data if no cache
        }
    };

    useEffect(() => {
        getVeggie();
    }, []); // Fetch data on component mount

    // Show skeleton loader while loading
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

    // Show error message if API fails
    if (error) {
        return (
            <Typography color="error" align="center" sx={{ mt: 5 }}>
                {error}
            </Typography>
        );
    }

    // Show fallback if no recipes are found
    if (veggie.length === 0) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No vegetarian recipes found. Please try again later.
            </Typography>
        );
    }

    // Render fetched vegetarian recipes
    return (
        <div className="veggie-container">
            <Typography variant="h4" align="center" gutterBottom>
                Veggie Picks
            </Typography>
            <Splide options={{ perPage: 4, pagination: false, gap: '2rem' }}>
                {veggie.map((recipe) => (
                    recipe && recipe.id ? (
                        <SplideSlide key={recipe.id}>
                            <RecipeCard data={recipe} />
                        </SplideSlide>
                    ) : null // Skip invalid recipes
                ))}
            </Splide>
        </div>
    );
};

export default Veggie;
