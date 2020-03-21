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


app.listen(process.env.PORT || 8080);