require('dotenv').config();
require('../../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
// const User = require('../../lib/models/User');

describe('Auth test', () => {

  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  it('can signup a new user', () => {
    const user = { 
      username: 'booboo3000', 
      password: 'abc123', 
      profilePhotoUrl: 'https://www.petmd.com/sites/default/files/petmd-shaking-puppy.jpg' };

    return request(app)
      .post('/auth/signup')
      .send(user)
      .then(res => {
        expect(res.body).toEqual({ 
          user: {
            username: 'booboo3000',
            _id: expect.any(String),
            profilePhotoUrl: 'https://www.petmd.com/sites/default/files/petmd-shaking-puppy.jpg'
          },
          token: expect.any(String)
        });
      });
  });
});
