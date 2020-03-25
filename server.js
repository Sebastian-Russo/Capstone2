'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { router: budgetRouter } = require('./budget');

const app = express();

app.use(express.static('public'));

app.use(morgan('common'));
app.use(express.json());

// Logging
app.use(morgan('common'));

app.use('/api/budget/', budgetRouter);

// catch all endpoints 
app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Not Found' });
  });



// runSever and closeServer functions here

app.listen(process.env.PORT || 8080, () => {
    console.log(`server listening on port 8080`)
});

module.exports = app;