const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user.route.js');
const watchlistRoute = require('./routes/watchlist.route.js');
const cors = require('cors');
require('dotenv').config();

//middleware
const app = express();

app.use(cors({
  origin: "https://movie-explorer-z.netlify.app", //replace with deployed frontend URL 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//port
const PORT = process.env.PORT;

//routes 
app.use('/api/users', userRoute);
app.use('/api/watchlist', watchlistRoute);

//Api Endpoints
app.get('/', (req, res) => {
    res.json({
        api: "Movie Explorer Backend API",
        version: "1.0",
        endpoints: [
            "POST /api/users - Register user",
            "POST /api/users/login - Login user",
            "GET /api/users/me - Get profile (requires token)",
            "GET /api/users - Get all users",
            "GET /api/users/:id - Get user by ID",
            "PUT /api/users/:id - Update user",
            "DELETE /api/users/:id - Delete user",
            "POST /api/watchlist - Create watchlist",
            "GET /api/watchlist/:username - Get watchlist",
            "POST /api/watchlist/:username/add - Add movie to watchlist",
            "POST /api/watchlist/:username/remove - Remove movie from watchlist"
        ],
        note: "Use Postman or similar tool to test POST endpoints"
    });
});

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });