'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const app = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('server', function() {

    it('should verify that when you hit up the root url for you client, you get a 200 status code and HMTL', function() {

        let res;
        return chai.request(app)
            .get('/')
            .then(_res => {
                res = _res;
                expect(res).to.have.status(200);
                // expect(res).to.be.json;
                // expect(res.body).to.be.a('object');
            })
    })
});

describe('/budget', function() {
    describe('POST', function() {
        it('Should create an object with the correct fields', function() {
            const newItem = { 
                monthlyBudget: 600, 
                costOfLiving: 1500,
                weeklyBudget: 150,
                weeklyItems: ["item", 30]
            }
            return chai
            .request(app)
            .post('/budget')
            .send(newItem)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('monthlyBudget', 'costOfLiving', 'weeklyBudget')
            })
        })

        
    });
});

