import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./Home";
import Cuisine from "./Cuisine";
import Category from "../components/Category";
import Search from "../components/Search";
import Searched from "./Searched";
import Recipe from "./Recipe";
import Header from "../components/Header";
import Favorites from "./Favorites";  // Import Favorites component
import UserDetails from './Userdetails';  // Import UserDetails component
import AddRecipe from './AddRecipe';

const Pages = () => {
    return (
        <>
            {/* Keep Header static across all pages */}
            <Header />

            <div className="pages-container">
                <Routes>
                    {/* Home Page */}
                    <Route path="/*" element={
                        <>
                            <Search />
                            <Category />
                            <Home />
                        </>
                    } />

                    {/* Cuisine Page */}
                    <Route path="/cuisine/:type" element={
                        <>
                            <Search />
                            <Category />
                            <Cuisine />
                        </>
                    } />

                    {/* Search Results Page */}
                    <Route path="/searched/:search" element={
                        <>
                            <Search />
                            <Category />
                            <Searched />
                        </>
                    } />

                    {/* Recipe Pages */}
                    <Route path="/searched/:search/recipe/:name" element={<Recipe />} />
                    <Route path="/cuisine/:type/recipe/:name" element={<Recipe />} />
                    <Route path="/recipe/:name" element={<Recipe />} />

                    {/* Favorites Page */}
                    <Route path="/favorites" element={<Favorites />} />

                    {/* User Details Page */}
                    <Route path="/userdetails" element={<UserDetails />} /> 
                    {/* Recipe adding Page */}
                    <Route path="/addrecipe" element={<AddRecipe />} />
                </Routes>
            </div>
        </>
    );
};

export default Pages;
