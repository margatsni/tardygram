const { Router } = require('express');
const Gram = require('../models/Gram');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { account, photoUrl, caption, tags } = req.body;
    Gram
      .create({ account, photoUrl, caption, tags })
      .then(gram => res.send(gram))
      .catch(next);
  });

