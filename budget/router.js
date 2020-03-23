'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Budget } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

// CRUD //

router.get("/", (req, res) => {
    res.json(Budget.get())
});

router.post("/", (req, res) => {
    const requiredFields = [""]
})

module.exports = {router};
