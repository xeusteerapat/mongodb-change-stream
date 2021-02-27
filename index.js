const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const scoreRouter = require('./routes/score');
const userRouter = require('./routes/user');

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    method: ['GET', 'POST'],
  },
});

io.of('/api/socket').on('connection', socket => {
  console.log('socket.io: User connected: ', socket.id);
  console.log('>>>>>>> <<<<<<<<');

  socket.on('disconnect', () => {
    console.log('socket.io: User disconnected: ', socket.id);
  });
});

const { connection } = mongoose;

connection.once('open', () => {
  console.log('Open connection for socket... 🎉');

  const leaderboardChangeStream = connection.collection('scores').watch();

  leaderboardChangeStream.on('change', async change => {
    if (change.operationType === 'update') {
      const allScores = await connection.models.Score.aggregate([
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

      io.of('/api/socket').emit('newScore', allScores);
    }
  });
});

const { PORT } = process.env;

app.use('/api', scoreRouter);
app.use('/api', userRouter);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
