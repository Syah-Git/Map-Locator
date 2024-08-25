const express = require("express");
const mysql = require('mysql2/promise');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const app = express();

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Database configuration
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "1234",
    database: "signup"
};

let db; // Variable to hold the database connection pool

// Initialize database connection
const initDb = async () => {
    try {
        db = await mysql.createPool(dbConfig); // Create a connection pool
        console.log("Connected to database.");
    } catch (err) {
        console.error("Database connection failed: " + err.stack);
    }
};

initDb(); // Call the function to initialize the database connection

// Route to add a new place
app.post('/api/addPlace', async (req, res) => {
    const { name, description, lat, lng } = req.body; // Extract data from request body
    try {
        // Insert new place into the database
        const [result] = await db.query("INSERT INTO places (name, description, lat, lng) VALUES (?, ?, ?, ?)", 
                                        [name, description, lat, lng]);
        res.send({ message: 'Place added successfully.', id: result.insertId }); // Send success response with the new place ID
    } catch (err) {
        console.error('Error adding the place:', err);
        res.status(500).send('Error adding the place'); // Send error response
    }
});

// Route to update a place
app.put('/api/updatePlace/:id', async (req, res) => {
    const { name, description, lat, lng } = req.body; // Extract data from request body
    const { id } = req.params; // Extract place ID from URL parameters
    try {
        // Update place details in the database
        await db.query("UPDATE places SET name = ?, description = ?, lat = ?, lng = ? WHERE id = ?", 
                       [name, description, lat, lng, id]);
        res.send({ message: 'Place updated successfully.' }); // Send success response
    } catch (err) {
        console.error('Error updating the place:', err);
        res.status(500).send('Error updating the place'); // Send error response
    }
});

// Route to get all places
app.get('/api/getPlaces', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM places"); // Retrieve all places from the database
        res.send(rows); // Send the list of places as a response
    } catch (err) {
        console.error('Error fetching places:', err);
        res.status(500).send('Error fetching places'); // Send error response
    }
});

// Route for user signup
app.post('/signup', async (req, res) => {
    const { name, username, password } = req.body; // Extract data from request body
    try {
        // Check if username already exists
        const [users] = await db.query("SELECT * FROM login WHERE username = ?", [username]);
        if (users.length > 0) {
            return res.json("Username already exists"); // Send response if username is taken
        }

        // Insert new user into the database
        await db.query("INSERT INTO login (name, username, password) VALUES (?)", 
                       [[name, username, password]]);
        return res.json("Success"); // Send success response
    } catch (err) {
        console.error('Error signing up:', err);
        return res.json("Error"); // Send error response
    }
});

// Route for user login with validation
app.post('/login', [
    // Validate username and password length
    check('username', "Username length error").isLength({ min: 3, max: 30 }),
    check('password', "Password length 8-10").isLength({ min: 8, max: 10 })
], async (req, res) => {
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
        return res.json(errors); // Send validation errors if any
    }

    try {
        // Check if the user exists with the provided username and password
        const [data] = await db.query("SELECT * FROM login WHERE username = ? AND password = ?", 
                                      [req.body.username, req.body.password]);
        if (data.length > 0) {
            return res.json("Success"); // Send success response if user is found
        } else {
            return res.json("Failed"); // Send failure response if user is not found
        }
    } catch (err) {
        console.error('Error logging in:', err);
        return res.json("Error"); // Send error response
    }
});

// Route to delete a place
app.delete('/api/deletePlace/:id', async (req, res) => {
    const { id } = req.params; // Extract place ID from URL parameters
    try {
        await db.query('DELETE FROM places WHERE id = ?', [id]); // Delete place from the database
        res.status(200).send('Marker deleted'); // Send success response
    } catch (error) {
        console.error('Error deleting marker:', error);
        res.status(500).send('Error deleting marker'); // Send error response
    }
});

// Start the server
app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
