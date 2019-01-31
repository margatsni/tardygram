require('dotenv').config();
require('../../lib/utils/connect')();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../lib/app');
const Gram = require('../../lib/models/Gram');
// const { Types } = require('mongoose');
const User = require('../../lib/models/User');

describe('Gram routes', () => {

  const createGram = (account, caption = 'cool', photoUrl = 'https://bit.ly/2CZbLR0', tags = ['#tags', '#tagsssss']) => {
    return createUser(account)
      .then(user => {
        return Gram.create({
          account: user._id,
          photoUrl,
          caption,
          tags
        })
          .then(gram => ({ ...gram, _id: gram._id.toString() }));
      });
  };

  const createUser = (username = 'booboo3000', password = 'abc123') => {
    return User.create({ username, password })
      .then(user => {
        return { ...user, _id: user._id.toString() };
      });
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

  it('can create a gram', done => {
    return request(app)
      .post('/grams')
      .send({
        photoUrl: 'https://www.catster.com/wp-content/uploads/2017/12/A-kitten-meowing.jpg',
        caption: 'Rarr',
        tags: ['#cute', '#fuzzy', '#adorbz', '#caturday']
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          photoUrl: 'https://www.catster.com/wp-content/uploads/2017/12/A-kitten-meowing.jpg',
          caption: 'Rarr',
          tags: ['#cute', '#fuzzy', '#adorbz', '#caturday']
        });
        done();
      });
  });

  it('can get a list of grams', () => {
    return Promise.all(['booboo3000', 'booboo3001'].map(el => createGram(el)))
      .then(() => {
        return request(app)
          .get('/grams');
      })
      .then(res => {
        expect(res.body).toHaveLength(2);
        expect(res.body).toEqual(
          [{ tags: ['#tags', '#tagsssss'],
            _id: expect.any(String),
            account: { _id: expect.any(String) },
            photoUrl: 'https://bit.ly/2CZbLR0',
            caption: 'cool' },
          { tags: ['#tags', '#tagsssss'],
            _id: expect.any(String),
            account: { _id: expect.any(String) },
            photoUrl: 'https://bit.ly/2CZbLR0',
            caption: 'cool' }]
        );
      });
  });

  it('can get a gram by id', () => {
    return createGram('booboo3000')
      .then(createdGram => {
        return request(app)
          .get(`/grams/${createdGram._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ 
          tags: ['#tags', '#tagsssss'],
          _id: expect.any(String),
          account: { _id: expect.any(String) },
          photoUrl: 'https://bit.ly/2CZbLR0',
          caption: 'cool' 
        });
      });
  });
});


