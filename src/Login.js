import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import './Login.css';
import logo from './logo.png'; 

function Login() {
    // State management for form values, validation errors, and backend errors
    const [values, setValues] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate(); // Navigation hook
    const [errors, setErrors] = useState({}); // State to store validation errors
    const [backendError, setBackendError] = useState([]); // State to store backend errors

    // Handle input changes and update state
    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values); // Validate input fields
        setErrors(err);

        // If no validation errors, submit the login form
        if (err.username === "" && err.password === "") {
            axios.post('http://localhost:8081/login', values)
                .then(res => {
                    if (res.data === "Success") {
                        localStorage.setItem('isLoggedIn', 'true'); // Store login state
                        navigate('/home'); // Navigate to home page on success
                    } else {
                        setBackendError([res.data]); // Handle backend errors
                    }
                })
                .catch(err => {
                    setBackendError([err.message]); // Handle network or other errors
                    console.log(err);
                });
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f7f7f7', fontFamily: 'Montserrat, sans-serif' }}>
            <img src={logo} alt="Logo" className="mb-4" style={{ width: '100px', height: '100px' }} />
            <div className="bg-white shadow-lg p-4 rounded" style={{ width: '350px' }}>
                <h3 className="mb-4 text-center text-primary">Sign In</h3>
                {/* Display backend errors if any */}
                {backendError.length > 0 && backendError.map((e, index) => (
                    <div className="alert alert-danger" key={index}>{e}</div>
                ))}
                <form onSubmit={handleSubmit}>
                    {/* Username input field */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label"><strong>Username</strong></label>
                        <input 
                            type="text" 
                            placeholder="Enter Username" 
                            name="username"
                            onChange={handleInput} 
                            className={`form-control ${errors.username && 'is-invalid'}`} 
                        />
                        {/* Display validation error for username */}
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    {/* Password input field */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label"><strong>Password</strong></label>
                        <input 
                            type="password" 
                            placeholder="Enter Password" 
                            name="password"
                            onChange={handleInput} 
                            className={`form-control ${errors.password && 'is-invalid'}`} 
                        />
                        {/* Display validation error for password */}
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    {/* Submit button */}
                    <button type="submit" className="btn btn-primary w-100">Log in</button>
                    {/* Link to signup page */}
                    <div className="text-center mt-3">
                        <Link to="/signup" className="text-decoration-none">Don't have an account? Create one</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
