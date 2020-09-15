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

// can also request by ID
router.get("/:id", jwtAuth, (req, res) => {
    Budget
      .findById(req.params.id) // `req.params.id` is the path URL id for a specific id
      .then(budget => {
        console.log('retrieved budget', budget);
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
    console.log(req.body)
    Budget.create({
        monthlyBudget: req.body.monthlyBudget,
        costOfLiving: req.body.costOfLiving,
        weeklyBudget: req.body.weeklyBudget,
        weeklyItems: req.body.weeklyItems
    })
    .then(budget => {
    console.log(budget)
    return res.status(201).json(budget.serialize())
   })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    });
});


router.put('/:id', jwtAuth, jsonParser, (req, res) => {
    console.log('POST REQUEST FROM SERVER', req.params.id, req.body)
    if(!(req.params.id && req.body.id && req.params.id == req.body.id)) {
        const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`)
        console.error(message);
        return res.status(400).json({message: message})
    }

    const toUpdate = {};
    const updateableFields = ["monthlyBudget", "costOfLiving", "weeklyBudget", "weeklyItems", "id"]

    updateableFields.forEach(field => {
        console.log('updatable fields', field, req.body, toUpdate)
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




