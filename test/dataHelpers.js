require('dotenv').config();
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { userGramData } = require('./seedData');
// const User = require('../lib/models/User');
// const Gram = require('../lib/models/Gram');
// const request = require('supertest');
// const app = require('../lib/app');

beforeAll(() => {
  connect();
});

beforeEach(done => {
  mongoose.connection.dropDatabase(done);
});

beforeEach(()=> {
  return userGramData({ });
});



