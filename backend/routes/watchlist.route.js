const express = require("express");
const router = express.Router();
const {
  getWatchlist,
  createWatchlist,
  addItem,
  removeItem,
} = require("../controllers/watchlist.controller");

router.get("/:username", getWatchlist);
router.post("/", createWatchlist);  
router.post("/:username/add", addItem);
router.post("/:username/remove", removeItem);

module.exports = router;
