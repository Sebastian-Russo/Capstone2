// require users to provide their credentials in order to access endpoints

'use strict';
// The strategy retrieves the username and password from the req.body and passes them to a callback function. We create a callback function that checks the credentials against the values stored in the DB. And we use the strategy to protect the /api/auth/login endpoint so users have to provide valid credentials in order to obtain access.
const { Strategy: LocalStrategy } = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../users/models');
const { JWT_SECRET } = require('../config');


const localStrategy = new LocalStrategy((username, password, callback) => {
  console.log('here');
  let user;
  // We look for a user with the supplied username. If the user is found, we then call the validatePassword instance method with the password from the request header.
  User.findOne({ username: username })
    .then(_user => {
      user = _user;
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      // validatePassword instance method with the password from the request header
      // We'll look at that function in a moment, but note that it returns a promise, which resolves with a boolean value indicating whether or not the password is valid. If the password is valid, the user object will be added to the request object at req.user. If not, we'll return an error message.
      return user.validatePassword(password);
    })
    // resolves with a boolean value indicating whether or not the password is valid. If the password is valid, the user object will be added to the request object at req.user. If not, we'll return an error message
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return callback(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});


// At this point our user has their JWT, and wants to use it to access an endpoint. In order to make this work, we need to set up a second Passport strategy. The first strategy allowed the user to supply a username and password to authenticate with an endpoint; this second strategy will do the same thing for JWTs.
const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  // If a valid JWT is supplied to the strategy, then the callback in the second argument to JwtStrategy will be run. In the callback, we indicate that we have authenticated successfully, assigning the user property decoded from the payload to req.user in the request object.
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };
