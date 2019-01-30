require('dotenv').config();
require('../../lib/utils/connect')();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../lib/app');
const User = require('../../lib/models/User');

describe('Auth test', () => {

  const createUser = (username, password) => {
    return User.create({ username, password });
  };

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

  it('can signin an existing user', () => {
    return createUser('booboo3000', 'abc123')
      .then(() => {
        return request(app)
          .post('/auth/signin')
          .send({
            username: 'booboo3000',
            password: 'abc123'
          });
      })
      .then(res => {
        expect(res.body).toEqual({
          user: {
            username: 'booboo3000',
            _id: expect.any(String)
          },
          token: expect.any(String)
        });
      });
  });

  it('can respond with an error if bad username', () => {
    return createUser('booboo3000', 'abc123')
      .then(() => {
        return request(app)
          .post('/auth/signin')
          .send({ username: 'blahblah3000', password: 'abc123' });
      })
      .then(res => {
        expect(res.status).toEqual(401);
        expect(res.body).toEqual({ error: 'Bad username or password' });
      });
  });
});
