const Chance = require('chance');
const Gram = require('../lib/models/Gram');
const User = require('../lib/models/User');


const chance = new Chance();

const userGramData = () => {

  return Promise.all([...Array(5)].map(() => {
    return User.create({
      username: chance.word(),
      password: chance.string(),
      profilePhotoUrl: chance.url({ extensions: ['gif', 'jpg', 'png'] })
    });
  }))
    .then(users => {
      return Promise.all([...Array(100)].map(() => {
        return Gram.create({
          account: chance.pickone(users)._id,
          photoUrl: chance.url({ extensions: ['gif', 'jpg', 'png'] }),
          caption: chance.sentence(),
          tags: [...chance.string()]
        });
      }));
    });
};

module.exports = { userGramData }; 
