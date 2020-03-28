'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const { Budget } = require('../budget/models');

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);





// generate placeholder values and then we insert that data into mongo
function seedBudgetData() {
    console.info('seeding budget data');
    const seedData = [];

    for (let i=1; i<10; i++) {
        seedData.push(generateBudgetData());
    }
    return Budget.insertMany(seedData);
}

// used to generate data to put in db
function generateMonthlyBudget() {
    const monthlyBudget = [400, 600, 800, 1000];
    return monthlyBudget[Math.floor(Math.random() * monthlyBudget.length)];
}

// used to generate data to put in db
function generateCostOfLiving() {
    const costOfLiving = [
        [{"item": "rent", "amount": 1500}],
        [{"item": "car", "amount": 500}],
        [{"item": "insurance", "amount": 200}],
        [{"item": "savings", "amount": 1000}],
        [{"item": "storage", "amount": 200}]
    ];
    return costOfLiving[Math.floor(Math.random() * costOfLiving.length)]
}

// used to generate data to put in db
function generateWeeklyBudget() {
    const weeklyBudget = [100, 150, 175, 200];
    return weeklyBudget[Math.floor(Math.random() * weeklyBudget.length)];
}

// used to generate data to put in db
function generateWeeklyItems() {
    const weeklyItems = [
        [{"item": "groceries", "amount": 30}],
        [{"item": "McD", "amount": 4}],
        [{"item": "gas", "amount": 40}],
        [{"item": "medicine", "amount": 10}],
        [{"item": "beer", "amount": 20}]
    ];
    return weeklyItems[Math.floor(Math.random() * weeklyItems.length)]
}

// generate an object represnting a restaurant.
// can be used to generate seed data for db
// or request.body data
function generateBudgetData() {
    return {
        monthlyBudget: generateMonthlyBudget(),
        costOfLiving: generateCostOfLiving(),
        weeklyBudget: generateWeeklyBudget(),
        weeklyItems: generateWeeklyItems()
    };
}

// this function deletes the entire database. we'll call it in an `afterEach` block below to ensure data from one test does not stick around for next one
function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}





describe('Budget', function() {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });
    
    beforeEach(function() {
        return seedBudgetData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function () {
    return closeServer();
    });




  describe('GET endpoint', function() {

    it('should list items on GET', function() {
        
        let resBudget;
        
        return chai
            .request(app)
            .get('/api/budget')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.budgets).to.be.a("array");
                expect(res.body.budgets).to.have.lengthOf.at.least(1);
                const expectedKeys = ['id','monthlyBudget', 'costOfLiving', 'weeklyBudget', 'weeklyItems'];
                
                res.body.budgets.forEach(function(item) {
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(expectedKeys);
                });
                resBudget = res.body.budgets[0];
                return Budget.findById(resBudget.id)
            })
            .then(function(budget) {
                expect(resBudget.id).to.equal(budget.id);
                expect(resBudget.monthlyBudget).to.equal(budget.monthlyBudget);
                expect(resBudget.costOfLiving).to.equal(budget.costOfLiving);
                expect(resBudget.weeklyBudget).to.equal(budget.weeklyBudget);
                expect(resBudget.weeklyItems).to.equal(budget.weeklyItems);
            });
    });
  });

  describe('PUT endpoint', function() {
  
    it('should create budget item on POST ', function() {
        
        // const newItem = { 
        //     monthlyBudget: 600, 
        //     costOfLiving: [{item: "rent", amount: 1500}],
        //     weeklyBudget: 150,
        //     weeklyItems: [{item: "groceries", amount: 30}]
        // };
        const newItem = generateBudgetData();

        return chai
        .request(app)
        .post('/api/budget')
        .send(newItem)
        .then(function(res){
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('monthlyBudget', 'costOfLiving', 'weeklyBudget', 'weeklyItems');
        })    
    });
  });

   describe('DELETE endpoint', function() {

        it('delete a budget object/document by id', function() {

          let budget;

          return Budget
            .findOne()
            .then(function(_budget) {
                budget = _budget;
                return chai.request(app).delete(`/api/budget/${budget.id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
                return Budget.findById(budget.id)
            })
            .then(function(_budget) {
                expect(_budget).to.be.null;
            });
        });
   });
});
