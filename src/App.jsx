import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Pages from './pages/Pages';  // This contains your main pages

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Sign In Route */}
          <Route path="/signin" element={<Signin />} />

          {/* Sign Up Route */}
          <Route path="/signup" element={<Signup />} />

          {/* Main Pages Route (like Home, Favorites, etc.) */}
          <Route path="/*" element={<Pages />} /> {/* This covers the subroutes inside Pages */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
