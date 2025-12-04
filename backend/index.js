const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user.route.js');
const watchlistRoute = require('./routes/watchlist.route.js');
const cors = require('cors');
require('dotenv').config();

//middleware
const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://movie-explorer-z.netlify.app"], //replace with deployed frontend URL 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//port
const PORT = process.env.PORT;

//routes 
app.use('/api/users', userRoute);
app.use('/api/watchlist', watchlistRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
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