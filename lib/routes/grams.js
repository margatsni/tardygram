const { Router } = require('express');
const Gram = require('../models/Gram');
const { HttpError } = require('../middleware/error');
const { ensureAuth } = require('../middleware/ensureUser');


const patcher = (body, fields) => {
  return Object.keys(body)
    .reduce((acc, key) => {
      if(fields.includes(key) && body[key]) {
        acc[key] = body[key];
      }
      return acc;
    }, {});
};

module.exports = Router()

  .post('/', ensureAuth, (req, res, next) => {
    const { photoUrl, caption, tags } = req.body;
    Gram
      .create({ account: req.user._id, photoUrl, caption, tags })
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
  })

  .patch('/:id', (req, res, next) => {
    const patched = patcher(req.body, ['account', 'caption', 'tags']);
    Gram
      .findByIdAndUpdate(req.params.id, patched, { new: true })
      .populate('account', { account: true })
      .select({ __v: false })
      .then(updatedGram => res.send(updatedGram))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Gram
      .findByIdAndDelete(req.params.id)
      .then(() => res.send({ deleted: 1 }))
      .catch(next);
  });

