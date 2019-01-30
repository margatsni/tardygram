require('dotenv').config();
require('../../lib/utils/connect')();
const mongoose = require('mongoose');
const { Types } = require('mongoose');
const User = require('../../lib/models/User');

describe('User', () => {
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
    const user = new User({
      username: 'booboo3000'
    });
    expect(user.toJSON()).toEqual({
      _id: expect.any(Types.ObjectId),
      username: 'booboo3000'
    });
  });

  it('has a required username field', () => {
    const user = new User({});
    const errors = user.validateSync().errors;
    expect(errors).toBeDefined();
    expect(errors.username['message']).toEqual('Path `username` is required.');
  });
});
