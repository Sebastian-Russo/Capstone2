'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password', 'email'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: `Missing field`,
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName', 'email'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: `Incorrect field type: expected string`,
      location: nonStringField
    });
  }

 const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 2
    },
    password: {
      min: 10,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );

  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }


  let {username, password, firstName = '', lastName = '', email} = req.body;

  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'  
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        email,
        firstName,
        lastName
      })
    })
    .then(user => { 
      // `.serialize()` creates an id after obj was created
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});


router.put('/:id', jsonParser, (req, res) => {
  // if `req.params.id` and `req.body.id` don't exist, and if they don't match, it fails
  if(!(req.params.id && req.body.id && req.params.id == req.body.id)) {
      const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`)
      console.error(message);
      return res.status(400).json({message: message})
  }

  const toUpdate = {};

  const canUpdate = ['firstName', 'lastName', 'budget'];

  canUpdate.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    };
  });
  
  User // `.findByIdAndUpdate` default to sending original object/document before `update` was applied, `{new: true}` will give you the object/document after `update` was applied 
      .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
      // `serialize()` structures the response
      .then(updateUser => { 
        res.status(200).json(updateUser.serialize())
      })
      .catch(err => res.status(500).json({message: 'Internal server error'}));
})



router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.get("/:id", (req, res) => {
  User
    .findById(req.params.id) 
    .then(user => {
      res.json({
      id: user._id,
    });
  })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});


module.exports = {router};
