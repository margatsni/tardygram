require('dotenv').config();
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const userGramData = require('./seedData');
const User = require('../lib/models/User');
const Comment = require('../lib/models/Comment');
const Gram = require('../lib/models/Gram');
const request = require('supertest');
const app = require('../lib/app');

beforeAll(() => {
  connect();
});

beforeEach(done => {
  mongoose.connection.dropDatabase(done);
});

beforeEach(()=> {
  return userGramData({ totalUsers: 3, totalGrams: 5, totalComments: 10 });
});

let token;
beforeEach(()=> {
  return User.findOne({ username: '1booboo3000' })
    .then(user => {
      return request(app)
        .post('/auth/signin')
        .send({ username: user.username, password: 'password' });
    })
    .then(res => {
      token = res.body.token;
    });
});

afterAll(done => {
  mongoose.connection.close(done);
});

const prepare = model => JSON.parse(JSON.stringify(model));
const prepareAll = models => models.map(prepare);
const createGetters = Model => {
  return {
    [`get${Model.modelName}`]: (query = {}) => Model.findOne(query).then(prepare),
    [`get${Model.modelName}s`]: (query = {}) => Model.find(query).then(prepareAll),
  };
};

module.exports = { 
  ...createGetters(User), 
  ...createGetters(Gram),
  ...createGetters(Comment), 
  getToken: () => token
};
