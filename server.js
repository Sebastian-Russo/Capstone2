'use strict';
require('dotenv').config(); //
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

// front end is going to use these endpoints to request information from the database through the server
// going to make a request to the server, the server is going to figure out what the request is talking about, query the database for the information that the front end is requesting, and then send that information to the front end
// front end's whole point: get data, manipulate data, and display data
// or front end - someone's signing up, it has to take user provided information and send that through the server, so that we can validate that user, and continue to use the application 
// front end is everything user interacts with to get and send information to your database 

// made `localStrategy()` in `strategies.js` to use in a route
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
// first arg is the name of the url path for the second arg
// second arg is the name for the router, named on line 9 
app.use('/api/budget/', budgetRouter);

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
  