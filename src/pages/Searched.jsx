import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import './Searched.css';
import { API_KEY } from "../assets/API_KEY";
import { Skeleton } from "@mui/material";

const Searched = () => {
    const [searchedRecipes, setSearchedRecipes] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const params = useParams();

    const getSearched = async (name) => {
        setLoading(true); // Show loader while fetching
        try {
            const data = await fetch(
                `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${name}`
            );
            const recipes = await data.json();
            console.log("API Response:", recipes); // Debug API response
            setSearchedRecipes(Array.isArray(recipes.results) ? recipes.results : []); // Safely set data
        } catch (error) {
            console.error("Failed to fetch searched recipes:", error);
            setSearchedRecipes([]); // Set empty array on error
        }
        setLoading(false); // Stop loader after fetching
    };

    useEffect(() => {
        getSearched(params.search);
    }, [params.search]);

    if (loading) {
        // Render skeletons while loading
        const number = Array.from({ length: 10 }, (_, index) => index + 1);
        return (
            <div className="cuisine-skeleton">
                {number.map((data) => (
                    <Skeleton
                        variant="rounded"
                        width={300}
                        height={200}
                        animation="wave"
                        key={data}
                    />
                ))}
            </div>
        );
    }

    if (searchedRecipes.length === 0) {
        // Render fallback if no recipes are found
        return <p className="no-results">No recipes found for "{params.search}".</p>;
    }

    return (
        <div className="searched-container">
            {searchedRecipes.map((data) => (
                <RecipeCard data={data} key={data.id} />
            ))}
        </div>
    );
};

export default Searched;
