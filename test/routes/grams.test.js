const {
  getGram, 
  getGrams,
  getToken
} = require('../dataHelpers');
const request = require('supertest');
const app = require('../../lib/app');

describe('Gram routes', () => {

  it('can create a gram', () => {
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
    return getGram()
      .then(foundGram => {
        return request(app)
          .get(`/grams/${foundGram._id}`);
      })
      .then(res => {
        expect(res.body).toEqual({ 
          tags: [expect.any(String), expect.any(String)],
          _id: expect.any(String),
          account: { _id: expect.any(String) },
          photoUrl: expect.any(String),
          caption: expect.any(String),
          comments: expect.any(Array) 
        });
      });
  });

  it('can update a gram by id', () => {
    return getGram()
      .then(gram => {
        return request(app)
          .patch(`/grams/${gram._id}`)
          .set('Authorization', `Bearer ${getToken()}`)
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




