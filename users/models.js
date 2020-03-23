'use strict';
// we're using the bcryptjs library (which is a JavaScript implementation of bcrypt, a popular password hashing function) to handle hashing user passwords
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// create the `UserSchema` with username, password, fist and last name objects with keys representing the values needed
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});

// take the `UserSchema` created just above and serialize each instance
UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

// used in `stategies.js`
// take the `UserSchema` created just above and 
// We use bcrypt to compare the plain text value passed to the function (password) with the hashed value stored on the user object (this.password), 
UserSchema.methods.validatePassword = function(password) {
  // ultimately resolving with a boolean value indicating if the password is valid.
  return bcrypt.compare(password, this.password);
};

// take the `UserSchema` created just above and 
// we're using the bcryptjs library (which is a JavaScript implementation of bcrypt, a popular password hashing function) to handle hashing user passwords
UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
