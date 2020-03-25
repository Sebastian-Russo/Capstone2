'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Budget } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

// CRUD //////

router.get("/", (req, res) => {
    res.json(Budget.get())
});

router.post("/", jsonParser, (req, res) => {
    const requiredFields = ["monthlyBudget", "costOfLiving", "weeklyBudget", "weeklyItems"]

    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        return res.status(400).json({
            message: `Required \`${field}\` missing.`
        });
    }

    Budget.create({
        monthlyBudget: req.body.monthlyBudget,
        costOfLiving: req.body.costOfLiving,
        weeklyBudget: req.body.weeklyBudget,
        weeklyItems: req.body.weeklyItems
    })
    .then(budget => res.status(201).json(budget.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    });
});

module.exports = {router};




