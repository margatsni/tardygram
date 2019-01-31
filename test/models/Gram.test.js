require('dotenv').config();
require('../../lib/utils/connect')();
const mongoose = require('mongoose');
const { Types } = require('mongoose');
const Gram = require('../../lib/models/Gram');

describe('Gram', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  it('validates a good model', () => {
    const gram = new Gram({
      photoUrl: 'https://www.catster.com/wp-content/uploads/2017/12/A-kitten-meowing.jpg',
      caption: 'Rarr',
      tags: ['#cute', '#fuzzy', '#adorbz', '#caturday']
    });
    expect(gram.toJSON()).toEqual({
      _id: expect.any(Types.ObjectId),
      photoUrl: 'https://www.catster.com/wp-content/uploads/2017/12/A-kitten-meowing.jpg',
      caption: 'Rarr',
      tags: ['#cute', '#fuzzy', '#adorbz', '#caturday']
    });
  });
});
