const express = require('express');
const { addScore, leaderboard, updateScore } = require('../controllers/score');
const router = express.Router();

router.get('/leaderboard', leaderboard);
router.post('/score', addScore);
router.put('/score', updateScore);

module.exports = router;
