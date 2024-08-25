import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignUpValidation';
import axios from 'axios';
import './Login.css';

function Signup() {
    // State management for form values and validation errors
    const [values, setValues] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate(); // Navigation hook
    const [errors, setErrors] = useState({}); // State to store validation errors

    // Handle input changes and update state
    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values); // Validate input fields
        setErrors(err);

        // If no validation errors, submit the signup form
        if (err.name === "" && err.username === "" && err.password === "" && err.confirmPassword === "") {
            axios.post('http://localhost:8081/signup', values)
                .then(res => {
                    navigate('/'); // Navigate to login page on success
                })
                .catch(err => console.log(err)); // Handle network or other errors
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f7f7f7', fontFamily: 'Montserrat, sans-serif' }}>
            <div className="bg-white shadow-lg p-4 rounded" style={{ width: '350px' }}>
                <h3 className="mb-4 text-center text-primary">Sign Up</h3>
                <form onSubmit={handleSubmit}>
                    {/* Name input field */}
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label"><strong>Name</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            name="name"
                            onChange={handleInput}
                            className={`form-control ${errors.name && 'is-invalid'}`}
                        />
                        {/* Display validation error for name */}
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
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
                    {/* Confirm Password input field */}
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label"><strong>Confirm Password</strong></label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            onChange={handleInput}
                            className={`form-control ${errors.confirmPassword && 'is-invalid'}`}
                        />
                        {/* Display validation error for confirmPassword */}
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                    {/* Submit button */}
                    <button type="submit" className="btn btn-primary w-100">Sign up</button>
                    {/* Link to login page */}
                    <div className="text-center mt-3">
                        <Link to="/" className="text-decoration-none">Already have an account? Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
