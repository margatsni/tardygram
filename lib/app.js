const express = require('express');
const app = express();
const notFound = require('./middleware/notFound');
const { handler } = require('./middleware/error');
const connection = require('./middleware/connection');
const { bearerToken } = require('./middleware/ensureUser');

app.use(require('morgan')('dev', {
  skip() {
    return process.env.NODE_ENV === 'test';
  }
}));

app.use(express.json());
app.use(bearerToken);
app.use('/auth', connection, require('./routes/auth'));

app.get('/', (req, res) => {
  res.status(200).send(
    'Welcome to Margatsni\'s TardyGram App'
  );
});

app.use(notFound);
app.use(handler);

module.exports = app;
