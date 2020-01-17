// implement your API here
const express = require('express');
const port = 5000;
const db = require('./data/db.js');
const server = express();
server.use(express.json()); //use this so the server can recognize the json data being parsed

server.get('/', (req, res) => {
  res.send('Welcome Home!');
});

//get users
server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be retrieved.' });
    });
});

//get specific user by id
server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res.status(404).json(JSON.stringify(err));
    });
});

//delete specific user by id
server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(delUser => {
      if (delUser) {
        res.status(200).json({ message: `User with id of ${id} deleted` });
      } else {
        res
          .status(404)
          .json({ message: 'The user with specified ID does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'The user could not be removed' });
    });
});

// create new user in database

server.post('/api/users', (req, res) => {
  const newUser = req.body;
  //const { name, bio } = req.body;
  //   console.log(newUser);
  //   console.log(name, bio);
  console.log(req.body);
  if (newUser.hasOwnProperty('name') && newUser.hasOwnProperty('bio')) {
    db.insert(newUser)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        res.status(500).json({
          errorMessage:
            'There was an error while saving the user to the database'
        });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user' });
  }
});

//edit a user
server.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  db.findById(id)
    .then(user => {
      if (user) {
        if (newData.hasOwnProperty('name') && newData.hasOwnProperty('bio')) {
          db.update(id, newData)
            .then(user => {
              res
                .status(200)
                .json({ user: user, message: 'successful update' });
            })
            .catch(err => {
              res.status(500).json({
                errorMessage: 'user information could not be modified'
              });
            });
        } else {
          res.status(400).json({ errorMessage: 'please provide name and bio' });
        }
      } else {
        res
          .status(404)
          .json({ message: 'The user with specified ID does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'Server Error' });
    });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
