const {
  getUser, 
  getGram, 
  getComment
} = require('../dataHelpers');
const request = require('supertest');
const app = require('../../lib/app');

describe('comments routes', () => {
  it('create a new comment', () => {
    return getGram()
      .then(gram => {
        return getUser()
          .then(user => {
            return request(app)
              .post('/comments')
              .send({
                commentBy: user._id,
                gram: gram._id,
                comment: 'this pic is blury'
              });
          })
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              commentBy: expect.any(String),
              gram: expect.any(String),
              comment: 'this pic is blury',
              __v: 0
            });
          });
      });
  });
  
  it('deletes a comment by id', () => {
    return getComment()
      .then(comment => {
        return Promise.all([
          Promise.resolve(comment._id),
          request(app)
            .delete(`/comments/${comment._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({
          __v: 0,
          _id,
          comment: expect.any(String),
          commentBy: expect.any(String),
          gram: expect.any(String),
        });
        return request(app)
          .get(`/comments/${_id}`);
      })
      .then(res => {
        expect(res.status).toEqual(404);
      });
  });
});
