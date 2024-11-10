import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./Home";
import Cuisine from "./Cuisine";
import Category from "../components/Category";
import Search from "../components/Search";
import Searched from "./Searched";
import Recipe from "./Recipe";
import Header from "../components/Header";
import Favorites from "./Favorites";
import UserDetails from './Userdetails';
import AddRecipe from './AddRecipe';
import UserProfile from './UserProfile';
import UserList from './UserList';
import AdminDashboard from './admin/AdminDashboard';
import ChatPage from './chat/ChatPage'; 
import Chat from './chat/Chat'; 
import RecipeDetails from '../components/RecipeDetails';

const Pages = () => {
    return (
        <>
            <Header />

            <div className="pages-container">
                <Routes>
                    {/* Admin Dashboard (specific route) */}
                    <Route path="/admin" element={<AdminDashboard />} />

                    {/* User List Page */}
                    <Route path="/users" element={<UserList />} />

                    {/* User Profile Page */}
                    <Route path="/user/:userId" element={<UserProfile />} />

                    {/* Favorites Page */}
                    <Route path="/favorites" element={<Favorites />} />

                    {/* User Details Page */}
                    <Route path="/userdetails" element={<UserDetails />} />

                    {/* Recipe Adding Page */}
                    <Route path="/addrecipe" element={<AddRecipe />} />

                    {/* Chat Pages */}
                    <Route path="/chat" element={<ChatPage userId="currentUserId" />} /> {/* Replace currentUserId */}
                    <Route path="/chat/:userId" element={<Chat userId="currentUserId" otherUserId=":userId" />} />

                    {/* Recipe Pages */}
                    <Route path="/searched/:search/recipe/:name" element={<Recipe />} />
                    <Route path="/cuisine/:type/recipe/:name" element={<Recipe />} />
                    <Route path="/recipe/:name" element={<Recipe />} />
                    <Route path="/recipes/:id" element={<RecipeDetails />} />

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

                    {/* Home Page (Wildcard Route - Always Last) */}
                    <Route path="/*" element={
                        <>
                            <Search />
                            <Category />
                            <Home />
                        </>
                    } />
                </Routes>
            </div>
        </>
    );
};

export default Pages;
