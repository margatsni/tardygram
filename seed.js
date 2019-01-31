require('dotenv').config();
require('./lib/utils/connect')();
// const { userGramData } = require('./test/seedData');
const userGramData = require('./test/seedData');
const mongoose = require('mongoose');

userGramData({})
  .then(() => console.log('done'))
  .finally(() => mongoose.connection.close());

