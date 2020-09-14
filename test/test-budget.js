'use strict';
require('dotenv').config(); //
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const { TEST_DATABASE_URL } = require('../config');

const { Budget } = require('../budget/models');
const { app, runServer, closeServer } = require("../server");


const expect = chai.expect;

chai.use(chaiHttp);


// function seedBudgetData() {
//     console.info('seeding budget data');
//     const seedData = [];

//     for (let i=1; i<10; i++) {
//         seedData.push(generateBudgetData());
//     }
//     return Budget.insertMany(seedData);
// }


let authToken;
let budgetId;

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

// generate an object representing a budget for db and req.body
function generateBudgetData() {
    return {
        monthlyBudget: generateMonthlyBudget(),
        costOfLiving: generateCostOfLiving(),
        weeklyBudget: generateWeeklyBudget(),
        weeklyItems: generateWeeklyItems()
    };
}


function seedUserData(userId) {
    console.info('THIRD seeding user data');
    const budgetData = generateBudgetData();
    console.log('FOURTH BUDGET DATA', budgetData, userId)
    budgetData.id = userId
        return chai.request(app)
            .post(`/api/budget/`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(budgetData)
            .then(res => {
                budgetId = res.body.id,
                authToken = res.body.authToken,
                console.log('FIFTH BUDGET DATA', res.body, 'budgetData.id is', budgetId)
            })
            .catch(err => console.log(err))
}

function logUserIn() {
    console.info('SECOND logging in')
    return chai.request(app) 
        .post('/api/auth/login')  
        .send({username: 'username', password: 'password12'}) 
        .then(res => {   
            authToken = res.body.authToken, 
            userId = res.body.id,  
            console.log('AUTH TOKEN AND USER ID', authToken, userId)
            seedUserData(userId)  
        })
        .catch(err => console.log(err))  
}

function createMockUser() {
    console.info('FIRST creating mock user')
    return chai.request(app)
        .post('/api/users/')
        .send({
            username: 'username', 
            password: 'password12',
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email@gmail.com'
        })
        .then(() => logUserIn())
        .catch(err => console.log(err))
}


function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Budget endpoints', function() {
    
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });
    
    beforeEach(function() {
        return seedUserData() && createMockUser();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });




  describe('GET endpoint', function() {

    it('should return all existing budgets', function() {
        let res;
        return chai.request(app)
          .get('/api/budget')
          .then(function(_res) {
              res = _res;
              expect(res).to.have.status(200);
              expect(res.body.budgets).to.have.lengthOf.at.least(1)
            
              return Budget.count();
          })
          .then(function(count) {
              expect(res.body.budgets).to.have.lengthOf(count);
          });
    });

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
                expect(resBudget.weeklyBudget).to.equal(budget.weeklyBudget);

                expect(resBudget.costOfLiving.item).to.equal(budget.costOfLiving.item);
                expect(resBudget.costOfLiving.amount).to.equal(budget.costOfLiving.amount);
                
                expect(resBudget.weeklyItems.item).to.equal(budget.weeklyItems.item);
                expect(resBudget.weeklyItems.amount).to.equal(budget.weeklyItems.amount);
            });
    });
  });

  describe('POST endpoint', function() {
  
    it('should create budget item on POST ', function() {
        
        // const newItem = { 
        //     monthlyBudget: 600, 
        //     costOfLiving: [{item: "rent", amount: 1500}],
        //     weeklyBudget: 150,
        //     weeklyItems: [{item: "groceries", amount: 30}]
        // };
        const newBudgetObj = generateBudgetData();
        let firstItem;
        let firstAmount;

        return chai
        // Once we get the response object, we inspect the status code and compare the returned object to the data we sent over.
        .request(app)
        .post('/api/budget')
        .send(newBudgetObj)
        .then(function(res){
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('monthlyBudget', 'costOfLiving', 'weeklyBudget', 'weeklyItems');

            expect(res.body.id).to.not.be.null;
            expect(res.body.monthlyBudget).to.equal(newBudgetObj.monthlyBudget);
            expect(res.body.weeklyBudget).to.equal(newBudgetObj.weeklyBudget);

            // firstItem = newBudgetObj.weeklyItems.item.sort((a, b) => b.date - a.date)[0].item;
            // firstAmount =newBudgetObj.weeklyItems.amount.sort((a, b) => b.date - a.date)[0].amount;

            // expect(res.body.weeklyItems.item).to.equal(firstItem);
            // expect(res.body.weeklyItems.amount).to.equal(firstAmount);


            return Budget.findById(res.body.id);
        })
        // After that, we retrieve the new budget from the DB and compare its data to the data we sent over.
        .then(function(budget) {
            expect(budget.monthlyBudget).to.equal(newBudgetObj.monthlyBudget);
            expect(budget.weeklyBudget).to.equal(newBudgetObj.weeklyBudget);

            expect(budget.costOfLiving.item).to.equal(newBudgetObj.costOfLiving.item)
            expect(budget.costOfLiving.amount).to.equal(newBudgetObj.costOfLiving.amount);

            expect(budget.weeklyItems.item).to.equal(newBudgetObj.costOfLiving.item)
            expect(budget.weeklyItems.amount).to.equal(newBudgetObj.costOfLiving.amount)
        })    
    });
  });


/// PUT endpoint ///

  describe('PUT endpoint', function() {

        // strategy:
        //  1. Get an existing restaurant from db
        //  2. Make a PUT request to update that restaurant
        //  3. Prove restaurant returned by request contains data we sent
        //  4. Prove restaurant in db is correctly updated
      it('should update budget object', function() {
          const updateData = generateBudgetData()
      
        return Budget  
            .findOne()
            .then(function(budget) {
                updateData.id = budget.id;
            // make request then inspect it to make sure it reflects data we sent
            return chai.request(app)
            .put(`/api/budget/${budget.id}`)
            .send(updateData);
            })
            .then(function(res) {
                expect(res).to.have.status(200);

                return Budget.findById(updateData.id)
            })
            .then(function(budget) {
                expect(budget.monthlyBudget).to.equal(updateData.monthlyBudget);
                expect(budget.weeklyBudget).to.equal(updateData.weeklyBudget);
    
                expect(budget.costOfLiving.item).to.equal(updateData.costOfLiving.item)
                expect(budget.costOfLiving.amount).to.equal(updateData.costOfLiving.amount);
    
                expect(budget.weeklyItems.item).to.equal(updateData.costOfLiving.item)
                expect(budget.weeklyItems.amount).to.equal(updateData.costOfLiving.amount)
            });    
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
