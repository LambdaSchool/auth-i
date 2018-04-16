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
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', function (next) {
  console.log('pre save hook');
  bcrypt.hash(this.password, 11, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;

    return next();
  });
});

UserSchema.methods.isPasswordValid = function (passwordGuess) {
  return bcrypt.compare(passwordGuess, this.password);
};

module.exports = mongoose.model('User', UserSchema);
