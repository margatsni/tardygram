const {
  // getUser, 
  getGram, 
  getGrams,
  getToken
} = require('../dataHelpers');
const request = require('supertest');
// const mongoose = require('mongoose');
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

  it.only('can create a gram', () => {
    return request(app)
      .post('/grams')
      .set('Authorization', `Bearer ${getToken()}`)
      .send({
        photoUrl: 'https://www.catster.com/wp-content/uploads/2017/12/A-kitten-meowing.jpg',
        caption: 'Rarr',
        tags: ['#cute', '#fuzzy', '#adorbz', '#caturday']
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          account: expect.any(String),
          photoUrl: 'https://www.catster.com/wp-content/uploads/2017/12/A-kitten-meowing.jpg',
          caption: 'Rarr',
          tags: ['#cute', '#fuzzy', '#adorbz', '#caturday']
        });

      });
  });

  it('can get a list of grams', () => {
    return request(app)
      .get('/grams')
      .then(res => {
        return Promise.all([
          Promise.resolve(res.body),
          getGrams()
        ]);
      })
      .then(([body, grams]) => {
        expect(body).toHaveLength(grams.length);
        grams.forEach(gram => {
          delete gram.__v;
          expect(body).toContainEqual({
            ...gram,
            account: { _id: gram.account }
          });
        });
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

  it('can update a gram by id', () => {
    return getGram()
      .then(gram => {
        return request(app)
          .patch(`/grams/${gram._id}`)
          .send({ caption: 'this is awesome!' });
      })
      .then(res => {
        expect(res.body).toEqual({
          tags: [expect.any(String), expect.any(String)],
          _id: expect.any(String),
          account: { _id: expect.any(String) },
          photoUrl: expect.any(String),
          caption: 'this is awesome!'
        });
      });
  });

  it('delete a gram by id', () => {
    return getGram()
      .then(gram => {
        return Promise.all([
          Promise.resolve(gram._id),
          request(app)
            .delete(`/grams/${gram._id}`)
        ]);
      })
      .then(([_id, res]) => {
        expect(res.body).toEqual({ deleted: 1 });
        return request(app)
          .get(`/grams/${_id}`);
      })
      .then(res => {
        expect(res.status).toEqual(404);
      });
  });
});




