'use strict';

require('dotenv').config(); 
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const { router: usersRouter } = require('./users');
const { router: budgetRouter } = require('./budget');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

const { PORT, DATABASE_URL } = require('./config');

mongoose.Promise = global.Promise;

const app = express();

app.use(express.static('public')); // serves files from public folder

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use(morgan('common'));
app.use(express.json());

app.use(passport.initialize()); // middleware function that has access to req/res object, which initializes authenication module, or rather:setups the functions to serialize/deserialize the user data from the request.
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/budget/', budgetRouter); // 1st arg is the name of the url path for the second arg, 2nd arg is the name for the router, named on line 9 
app.use('/api/users/', usersRouter); // made `localStrategy()` in `strategies.js` to use in a route
app.use('/api/auth/', authRouter);

// catch all endpoints 
app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
});


let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}
  
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
  