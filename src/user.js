const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true });

const UserSchema = new mongoose.Schema({
  // TODO: fill in this schema
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
    unique: true,
  },
});
// eslint-disable-next-line
UserSchema.pre('save', function(next) {
  bcrypt.hash(this.passwordHash, 2, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.passwordHash = hash;
    return next();
  });
});
// eslint-disable-next-line
UserSchema.methods.isPasswordValid = function(passwordGuess) {
  console.log(bcrypt.compare(passwordGuess, this.passwordHash));
  return bcrypt.compare(passwordGuess, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
