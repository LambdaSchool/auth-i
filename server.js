const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const userRouter = require('./Users/userRouter');

const server = express();
const port = 5000;

server.use(helmet());
server.use(cors());
server.use(express.json());

mongoose.connect('mongodb://localhost/UserAuthDB')
  .then(connection => {
    console.log('Connected to MongoDB.');
  })
  .catch(err => {
    console.log('Failed to connect to MongoDB', err);
  })

  server.use('/api', userRouter );


  server.listen(port, () => {
      console.log(`===== Connected on port ${port} =====`)
  });