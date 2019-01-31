const { Router } = require('express');
const Gram = require('../models/Gram');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { account, photoUrl, caption, tags } = req.body;
    Gram
      .create({ account, photoUrl, caption, tags })
      .then(gram => res.send(gram))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Gram
      .find()
      .populate('account', { account: true })
      .select({ __v: false })
      .then(grams => res.send(grams))
      .catch(next);
  });
