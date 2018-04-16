const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Clear out mongoose's model cache to allow --watch to work for tests:
// https://github.com/Automattic/mongoose/issues/1251
mongoose.models = {};
mongoose.modelSchemas = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/users', { useMongoClient: true })
  .then(() => {
    console.log('\n=== connected to MongoDB ===\n');
  })
  .catch(err => console.log('database connection failed', err));

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    passwordHash: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    passwordHash: String,
    required: true,
  },
});

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 2, (err, hash) => {
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
