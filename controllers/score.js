const Score = require('../models/Score');
const mongoose = require('mongoose');

const addScore = async (req, res) => {
  const { userId, score } = req.body;

  const newScore = await Score.create({
    userId: mongoose.Types.ObjectId(userId),
    score: Number(score),
  });

  res.send(newScore);
};

const updateScore = async (req, res) => {
  const { userId, score } = req.body;

  const updatedScore = await Score.findOneAndUpdate(
    {
      userId: mongoose.Types.ObjectId(userId),
    },
    { score },
    { new: true, runValidators: true, timestamps: true }
  );

  res.send(updatedScore);
};

const leaderboard = async (req, res) => {
  const leaderboards = await Score.aggregate([
    {
      $match: {},
    },
    {
      $sort: { score: -1 },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $addFields: {
        username: '$users.name',
      },
    },
    {
      $unwind: '$username',
    },
  ]);

  res.send(leaderboards);
};

module.exports = {
  addScore,
  leaderboard,
  updateScore,
};
