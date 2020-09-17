'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Budget } = require('./models');
const { jwtAuth } = require('../auth');

const router = express.Router();

const jsonParser = bodyParser.json();


// CRUD //////

router.get("/", jwtAuth, (req, res) => {
    Budget.find()
        .then(budgets => {
            res.json({
            budgets: budgets.map(budget => budget.serialize())
          })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
});


router.get("/:id", jwtAuth, (req, res) => {
    Budget
      .findById(req.params.id) // `req.params.id` is the path URL id for a specific id
      .then(budget => {
        res.json({
        id: budget._id,
        monthlyBudget: budget.monthlyBudget,
        costOfLiving: budget.costOfLiving,
        weeklyBudget: budget.weeklyBudget,
        weeklyItems: budget.weeklyItems
      });
    })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      });
});

router.post("/", jwtAuth, jsonParser, (req, res) => {

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
    .then(budget => {
        return res.status(201).json(budget.serialize())
   })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    });
});


router.put('/:id', jwtAuth, jsonParser, (req, res) => {
    if(!(req.params.id && req.body.id && req.params.id == req.body.id)) {
        const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`)
        console.error(message);
        return res.status(400).json({message: message})
    }

    const toUpdate = {};
    const updateableFields = ["monthlyBudget", "costOfLiving", "weeklyBudget", "weeklyItems", "id"]

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    
    Budget
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(updateBudget => res.status(204).json({
        id: updateBudget.id,
        monthlyBudget: updateBudget.monthlyBudget,
        costOfLiving: updateBudget.costOfLiving,
        weeklyBudget: updateBudget.weeklyBudget,
        weeklyItems: updateBudget.weeklyItems
        }))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
})

router.delete("/:id", jwtAuth, (req, res) => {
    Budget.findByIdAndRemove(req.params.id)
      .then(budget => res.status(204).end())
      .catch(err => res.status(500).json({ message: "Internal server error" }));
  });

module.exports = {router};




