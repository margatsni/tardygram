const mongoose = require('mongoose');
// const { hash, compare } = require('../../lib/utils/hash');
// const { tokenize, untokenize } = require('../../lib/utils/token');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[a-z.0-9A-Z_-]+@[a-z0-9A-Z_-]+?\.[a-zA-Z]{2,3}$/.test(v);
      },
      message: props => `'${props.value}' is not a valid email!`
    },
    unique: true,
    required: [true, 'Email is required.']
  },
  passwordHash: String
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.passwordHash;
    }
  }
});

userSchema.virtual('password').set(function(password) {
  this._tempPassword = password;
});

// userSchema.pre('save', function(next) {
//   hash(this._tempPassword)
//     .then(hashedPassword => {
//       this.passwordHash = hashedPassword;
//       next();
//     });
// });

// userSchema.methods.compare = function(password) {
//   return compare(password, this.passwordHash);
// };

// userSchema.statics.findByToken = function(token) {
//   return Promise.resolve(untokenize(token));
// };

// userSchema.methods.authToken = function() {
//   return tokenize(this.toJSON());
// };

const User = mongoose.model('User', userSchema);

module.exports = User;
