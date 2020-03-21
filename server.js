'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const app = express();

app.use(express.static('public'));

app.use(morgan('common'));
app.use(express.json());

// CRUD
app.get('/', (req, res) => {
    res.status(200)
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`server listening on port 8080`)
});

module.exports = app;