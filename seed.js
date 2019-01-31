require('dotenv').config();
require('./lib/utils/connect')();
const userGramData = require('./test/seedData');
const mongoose = require('mongoose');

userGramData({})
  // eslint-disable-next-line no-console
  .then(() => console.log('done'))
  .finally(() => mongoose.connection.close());

