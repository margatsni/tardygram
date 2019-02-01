const { Router } = require('express');
const Gram = require('../models/Gram');
const Comment = require('../models/Comment');
const { HttpError } = require('../middleware/error');
const { ensureAuth } = require('../middleware/ensureUser');

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
    return Promise.all([
      Gram
        .findById(req.params.id)
        .populate('account', { account: true })
        .select({ __v: false })
        .lean(),
      Comment
        .find({ gram: req.params.id })
        .populate('commentBy')
    ])
      .then(([gram, comments]) => {
        if(!gram) {
          return next(new HttpError(
            404, `No gram found with id ${req.params.id}`
          ));
        }
        res.send({ ...gram, comments });
      })
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    const { caption } = req.body;
    Gram
      .findByIdAndUpdate(req.params.id, { caption }, { new: true })
      .populate('account', { account: true })
      .select({ __v: false })
      .then(updatedGram => res.send(updatedGram))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Gram
      .findByIdAndDelete(req.params.id)
      .then(deletedGram => res.send(deletedGram))
      .catch(next);
  });

