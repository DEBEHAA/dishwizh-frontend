import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';

const Favorites = () => {
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load favorites from local storage
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavoriteRecipes(storedFavorites);
        setLoading(false);
    }, []);

    // Function to toggle favorite
    const toggleFavorite = (recipe) => {
        const isFavorite = favoriteRecipes.some(fav => fav.id === recipe.id);
        let updatedFavorites;

        if (isFavorite) {
            updatedFavorites = favoriteRecipes.filter(fav => fav.id !== recipe.id);
        } else {
            updatedFavorites = [...favoriteRecipes, recipe];
        }

        setFavoriteRecipes(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="favorites-container">
            <h1>Your Favorite Recipes</h1>
            {favoriteRecipes.length > 0 ? (
                favoriteRecipes.map(recipe => (
                    <RecipeCard 
                        key={recipe.id} 
                        data={recipe} 
                        isFavorite={favoriteRecipes.some(fav => fav.id === recipe.id)}
                        onToggleFavorite={() => toggleFavorite(recipe)}
                    />
                ))
            ) : (
                <p>You have no favorite recipes yet.</p>
            )}
        </div>
    );
};

export default Favorites;
