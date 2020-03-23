'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

// We use the jwt.sign function to create a signed JWT. The first argument is the payload, in this case an object containing the information about our user.
// The second argument is the secret key that we use to sign the JWT with.
// The third argument contains additional options and claims: we set up the sub and exp claims using the subject and expiresIn properties, and specify that we want to use the HS256 algorithm to sign the token
// This createAuthToken function is used in the /api/auth/login route
const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

// To use the strategy in a route, we must register the strategy in server.js
// Then we can use the strategy to protect the /api/auth/login endpoint, defined in /auth/router.js:
// To use our local auth strategy, we call passport.authenticate('local', {session: false}), which returns a middleware function. Store a reference to the middleware function in a variable, and pass it as the second argument to the .post endpoint. 
// We set session to false to stop Passport from adding session cookies, which identify the user to the response. Instead of using these cookies to authenticate, the user supplies their JWT in a request header. This helps prevent against cross-site request forgery (CSRF) attacks, which can allow attackers to gain access to a user's details.
const localAuth = passport.authenticate('local', {session: false});

router.use(bodyParser.json());

// The user provides a username and password to `/login` as a `req`
// 2nd arg is the var we just made above
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({authToken});
});

// The final part of the login system allows users to refresh their tokens, receiving a token with a later expiry date when they supply a valid token to /api/auth/refresh:
const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
// The endpoint is protected using the JWT strategy, meaning users have to provide a valid, non-expired JWT in order to refresh their token. If they authenticate successfully, then we create a new JWT, using the req.user information taken from the payload of the old JWT as the new payload. We then send the new JWT back to the user. For subsequent requests they can use this newer token to authenticate with the API endpoints.
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

// Note that in endpoints secured by the JWT strategy, req.user will point to the representation of the user that was decoded from the payload. This is in contrast to endpoints secured by local authentication, where req.user points to the user object fetched from the database. This means that in /api/auth/login, which is protected by local auth, we need to use req.user.serialize() as the JWT payload, whereas in /api/auth/refresh, which is protected by the JWT strategy, the payload for the new token is just req.user

module.exports = {router};