require('dotenv').config();
require('../../lib/utils/connect')();
const mongoose = require('mongoose');
const { Types } = require('mongoose');
const Gram = require('../../lib/models/Gram');
// const User = require('../../lib/models/User');

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
    // const user = new User({
    //   username: 'booboo3000',
    //   password: 'abc123',
    //   profilePhotoUrl: 'https://www.petmd.com/sites/default/files/petmd-shaking-puppy.jpg'
    // });
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
