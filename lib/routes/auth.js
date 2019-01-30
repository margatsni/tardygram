const { Router } = require('express');
// const { HttpError } = require('../middleware/error');
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
  });
