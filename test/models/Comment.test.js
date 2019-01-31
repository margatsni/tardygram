require('dotenv').config();
require('../../lib/utils/connect')();
const mongoose = require('mongoose');
const { Types } = require('mongoose');
const Comment = require('../../lib/models/Comment');

describe('Comment model', () => {
  
  beforeEach(done => {
    mongoose.connection.dropDatabase(done);
  });

  afterAll(done => {
    mongoose.connection.close(done);
  });

  it('validates a good Comment model', () => {
    const comment = new Comment({ comment: 'what a lovely gram!' });
    expect(comment.toJSON()).toEqual({ 
      comment: 'what a lovely gram!',
      _id: expect.any(Types.ObjectId) 
    });
  });
});
