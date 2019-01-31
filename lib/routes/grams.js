const { Router } = require('express');
const Gram = require('../models/Gram');
const { HttpError } = require('../middleware/error');

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
  })
  
  .get('/:id', (req, res, next) => {
    Gram
      .findById(req.params.id)
      .populate('account', { account: true })
      .select({ __v: false })
      .then(foundGram => {
        if(!foundGram) {
          return next(new HttpError(
            404, `No gram found with id ${req.params.id}`
          ));
        }
        res.send(foundGram);
      })
      .catch(next);
  });
