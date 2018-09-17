const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const db = require("./db/helpers");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.get("/", (req, res) => {
  res.send("You made it!");
});

server.post("/api/register", (req, res) => {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 10);
  creds.password = hash;
  console.log(creds.password);

  db.hashUser(creds)
    .then(id => {
      res.status(200).json(id);
    })
    .catch(err => res.status(500).send("error creating user"));
});

const port = 9000;
server.listen(
  port,
  console.log(`\n ===> Server is running on port:${port} <=== \n`)
);
