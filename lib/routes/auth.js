const { Router } = require('express');
const { HttpError } = require('../middleware/error');
const User = require('../models/User');
// const { ensureAuth } = require('../middleware/ensureUser');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const { username, password, profilePhotoUrl } = req.body;
    User
      .create({ username, password, profilePhotoUrl })
      .then(user => res.send({
        user,
        token: user.authToken()
      }))
      .catch(next);
  })
  .post('/signin', (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username })
      .then(user => {
        if(!user) {
          return next(new HttpError(401, 'Bad username or password'));
        }
        return Promise.all([
          Promise.resolve(user),
          user.compare(password)
        ]);
      })
      .then(([user, correct]) => {
        if(correct) {
          res.send({ user, token: user.authToken() });
        } else next(new HttpError(401, 'Bad username or password'));
      })
      .catch(next);
  });
