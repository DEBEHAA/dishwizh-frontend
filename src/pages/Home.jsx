// components/Home.js
import React from 'react';
import Popular from "../components/Popular";
import Veggie from "../components/Veggie";
import MyRecipes from "../components/MyRecipes";
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <Popular />
            <Veggie />
            <MyRecipes />
        </div>
    );
};

export default Home;
