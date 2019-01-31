require('dotenv').config();
require('../../lib/utils/connect')();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../lib/app');
const Gram = require('../../lib/models/Gram');
// const User = require('../../lib/models/User');

describe('Gram routes', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });
  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  it('can create a gram', done => {
    return request(app)
      .post('/grams')
      .send({
        photoUrl: 'https://www.catster.com/wp-content/uploads/2017/12/A-kitten-meowing.jpg',
        caption: 'Rarr',
        tags: ['#cute', '#fuzzy', '#adorbz', '#caturday'],
        // account: user._id
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          photoUrl: 'https://www.catster.com/wp-content/uploads/2017/12/A-kitten-meowing.jpg',
          caption: 'Rarr',
          tags: ['#cute', '#fuzzy', '#adorbz', '#caturday']
          // account: expect.any(String)
        });
        done();
      });
  });

  it('can get a list of grams', () => {
    return Promise.all([
      {
        photoUrl: 'https://www.catster.com/wp-content/uploads/2017/12/A-kitten-meowing.jpg',
        caption: 'Rarr1',
        tags: ['#cute', '#fuzzy', '#adorbz', '#caturday']
      },
      {
        photoUrl: 'https://www.catster.com/wp-content/uploads/2017/12/A-kitten-meowing.jpg',
        caption: 'Rarr2',
        tags: ['#cute', '#fuzzy', '#adorbz', '#caturday']
      }
    ].map(gram => Gram.create(gram)))
      .then(() => {
        return request(app)
          .get('/grams');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });
});


