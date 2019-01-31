const Chance = require('chance');
const Gram = require('../lib/models/Gram');
const User = require('../lib/models/User');

const chance = new Chance();

const DEFAULT_TOTAL_USERS = 10;
const DEFAULT_TOTAL_GRAMS = 1000;

module.exports = ({ totalUsers = DEFAULT_TOTAL_USERS, totalGrams = DEFAULT_TOTAL_GRAMS }) => {

  return Promise.all([...Array(totalUsers)].map((ele, i) => {
    return User.create({
      username: `${i}${chance.word()}`,
      password: chance.string(),
      profilePhotoUrl: chance.url({ extensions: ['gif', 'jpg', 'png'] })
    });
  }))
    .then(users => {
      return Promise.all([...Array(totalGrams)].map(() => {
        return Gram.create({
          account: chance.pickone(users)._id,
          photoUrl: chance.url({ extensions: ['gif', 'jpg', 'png'] }),
          caption: chance.sentence(),
          tags: [chance.hashtag(), chance.hashtag()]
        });
      }));
    });
};
