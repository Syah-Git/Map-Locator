
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Signup from './SignUp';
import Home from './Home';

// Function to check if the user is logged in
const isLoggedIn = () => {
    return !!localStorage.getItem('isLoggedIn');  // Check if the 'isLoggedIn' flag is in localStorage
};

// A component to protect routes
const ProtectedRoute = ({ element }) => {
    return isLoggedIn() ? element : <Navigate to="/" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/home"
                    element={<ProtectedRoute element={<Home />} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;