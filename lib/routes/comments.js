const { Router } = require('express');
const Comment = require('../models/Comment');
// const { HttpError } = require('../middleware/error');

module.exports = Router()

  .post('/', (req, res, next) => {
    const { commentBy, gram, comment } = req.body;
    Comment
      .create({
        commentBy,
        gram,
        comment
      })
      .then(comment => res.send(comment))
      .catch(next);
  });
