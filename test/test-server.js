'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const { TEST_DATABASE_URL } = require('../config');


// const app = require('../server');

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe('server', function() {

    before(function () {
        return runServer(TEST_DATABASE_URL);
      });
    
      after(function () {
        return closeServer();
      });

    it('should verify that when you hit up the root url for you client, you get a 200 status code and HMTL', function() {

        let res;
        return chai
            .request(app)
            .get('/')
            .then(_res => {
                res = _res;
                expect(res).to.have.status(200);
                // expect(res).to.be.json;
                // expect(res.body).to.be.a('object');
            })
    })


describe('/budget', function() {
    describe('POST', function() {
        it('Should create an object with the correct fields', function() {
            const newItem = { 
                monthlyBudget: 600, 
                costOfLiving: [{item: "rent", amount: 1500}],
                weeklyBudget: 150,
                weeklyItems: [{item: "groceries", amount: 30}]
            }
            return chai
            .request(app)
            .post('/budget')
            .send(newItem)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('monthlyBudget', 'costOfLiving', 'weeklyBudget', 'weeklyItems')
            })
        })

        
    });
});

});