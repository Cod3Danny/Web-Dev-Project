const Watchlist = require("../models/watchlist.model");

// Get watchlist by username
const getWatchlist = async (req, res) => {
  try {
    const { username } = req.params;
    const wl = await Watchlist.findOne({ username });

    if (!wl) return res.status(404).json({ message: "Watchlist not found" });

    res.json(wl);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create watchlist for a user
const createWatchlist = async (req, res) => {
  try {
    const { username } = req.body;

    const existing = await Watchlist.findOne({ username });
    if (existing) return res.status(400).json({ message: "Watchlist already exists" });

    const wl = await Watchlist.create({ username, movies: [] });
    res.status(201).json(wl);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item to watchlist
const addItem = async (req, res) => {
  try {
    const { username } = req.params;
    const { link } = req.body;

    let wl = await Watchlist.findOne({ username });
    if (!wl) wl = await Watchlist.create({ username, movies: [] });

    if (wl.movies.includes(link)) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    wl.movies.push(link);
    await wl.save();

    res.json(wl);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete item from watchlist
const removeItem = async (req, res) => {
  try {
    const { username } = req.params;
    const { link } = req.body;

    const wl = await Watchlist.findOne({ username });
    if (!wl) return res.status(404).json({ message: "Watchlist not found" });

    wl.movies = wl.movies.filter(movieLink => movieLink !== link);
    await wl.save();

    res.json(wl);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getWatchlist,
  createWatchlist,
  addItem,
  removeItem
};
