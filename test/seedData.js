const Chance = require('chance');
const Gram = require('../lib/models/Gram');
const User = require('../lib/models/User');
const Comment = require('../lib/models/Comment');

const chance = new Chance();

const DEFAULT_TOTAL_USERS = 10;
const DEFAULT_TOTAL_GRAMS = 1000;
const DEFAULT_TOTAL_COMMENTS = 500;


module.exports = ({ totalUsers = DEFAULT_TOTAL_USERS, totalGrams = DEFAULT_TOTAL_GRAMS, totalComments = DEFAULT_TOTAL_COMMENTS }) => {

  return Promise.all([...Array(totalUsers)].map((ele, i) => {
    return User.create({
      username: `${i}booboo3000`,
      password: 'password',
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
      }))
        .then(grams => {
          return Promise.all([...Array(totalComments)].map(() => {
            return Comment.create({
              commentBy: chance.pickone(users)._id,
              gram: chance.pickone(grams)._id,
              comment: chance.sentence()
            });
          }));
        });
    });

};
