const express = require('express');
const app = express();
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');
const connection = require('../lib/middleware/connection');

app.use(require('morgan')('dev', {
  skip() {
    return process.env.NODE_ENV === 'test';
  }
}));

app.use(express.json());
app.use('/auth', connection, require('./routes/auth'));

app.get('/', (req, res) => {
  res.status(200).send(
    'Welcome to Margatsni\'s TardyGram App'
  );
});

app.use(notFound);
app.use(handler);

module.exports = app;
