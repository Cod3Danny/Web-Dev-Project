const { json } = require('express');
const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
    {
        username: { type: String, required: [true, 'Username is required'], unique: true },
        movies: { type: [], default: [] },
    }, { timestamps: false });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;