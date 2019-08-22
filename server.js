const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcrypt');

const db = require('./data/db-config.js');

const server = express();

server.use(express.json());
server.use(helmet());

// ROUTES
server.get('/api/users', validate, async (req, res) => {
  try {
    const users = await db('users');

    if (users) {
      res.status(200).json(users);
    }
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
})

server.post('/api/register', async (req, res) => {
  const user = req.body;

  try {
    if (user.username && user.password) {
      // Hash password
      const hash = bcrypt.hashSync(user.password, 5);
      user.password = hash;

      console.log(user);

      const userReg = await db('users').insert(user);

      if (userReg) {
        res.status(201).json({userReg});
      } else {
        res.status(404).json({
          message: 'User registeration is not valid'
        })
      }
    } else {
      res.status(400).json({
        message: "All required fields not found."
      })
    }
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
})

server.post('/api/login', (req, res) => {

})

// FALLBACK
server.use('/', (req, res) => {
  res.send('<p>User Auth Server</p>');
})

// MIDDLEWARE
async function validate(req, res, next) {
  const userTry = req.headers;

  try {
    if (userTry.username && userTry.password) {
      // Get user hashed password
      const user = await db('users').where('username', userTry.username).first();
      console.log(user);

      // Hash password check
      const attempt = bcrypt.compareSync(userTry.password, user.password);

      if (attempt) {
        next();
      } else {
        res.status(404).json({
          message: 'The username or password is incorrect. Please try again.'
        })
      }
    } else {
      res.status(400).json({
        message: "All required fields not found."
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}

module.exports = server;