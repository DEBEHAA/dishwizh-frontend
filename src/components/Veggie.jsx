import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Skeleton, Typography } from "@mui/material";

const Veggie = () => {
    const API_KEY = '71ee729777aa439ba75c472c3bca40b4';

    const [veggie, setVeggie] = useState([]); // State to store recipes
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error message

    const fetchVeggieData = async () => {
        try {
            const api = await fetch(
                `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=10&tags=vegetarian`
            );
            const data = await api.json();
            if (data?.recipes && Array.isArray(data.recipes)) {
                localStorage.setItem('veggie', JSON.stringify(data.recipes)); // Store in localStorage
                setVeggie(data.recipes); // Set recipes to state
            } else {
                throw new Error("Invalid API response format.");
            }
        } catch (err) {
            console.error("Error fetching veggie data:", err);
            setError("Failed to load vegetarian recipes. Please try again later.");
            setVeggie([]); // Ensure veggie is set to an empty array to avoid rendering issues
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    const getVeggie = async () => {
        const check = localStorage.getItem('veggie');

        if (check) {
            try {
                const parsedVeggie = JSON.parse(check);
                if (Array.isArray(parsedVeggie)) {
                    setVeggie(parsedVeggie);
                } else {
                    console.warn("Invalid localStorage data. Fetching new data...");
                    localStorage.removeItem('veggie');
                    await fetchVeggieData();
                }
            } catch (err) {
                console.error("Error parsing localStorage data:", err);
                localStorage.removeItem('veggie');
                await fetchVeggieData();
            }
        } else {
            await fetchVeggieData();
        }
    };

    useEffect(() => {
        getVeggie();
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

    if (veggie.length === 0) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No vegetarian recipes found. Please try again later.
            </Typography>
        );
    }

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
                    ) : null
                ))}
            </Splide>
        </div>
    );
};

export default Veggie;
