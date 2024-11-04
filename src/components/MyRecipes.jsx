import React, { useState, useEffect } from 'react';
import RecipeCard from "./RecipeCard";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { Skeleton } from "@mui/material";
import axios from 'axios';

const MyRecipes = () => {
    const [myRecipes, setMyRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const getMyRecipes = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/${userId}`);
            setMyRecipes(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching custom recipes:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyRecipes();
    }, []);

    if (loading) {
        const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return (
            <Splide options={{
                perPage: 4,
                pagination: false,
                gap: '2rem'
            }}>
                {number.map((data) => (
                    <SplideSlide key={data}>
                        <Skeleton height={200} width={300} />
                    </SplideSlide>
                ))}
            </Splide>
        );
    }

    return (
        <div className="my-recipes-container">
            <h1>My Recipes</h1>
            <Splide options={{
                perPage: 4,
                pagination: false,
                gap: '2rem',
            }}>
                {myRecipes.map((recipe) => (
                    <SplideSlide key={recipe._id}>
                        <RecipeCard data={{ ...recipe, isCustom: true }} />
                    </SplideSlide>
                ))}
            </Splide>
        </div>
    );
};

export default MyRecipes;
