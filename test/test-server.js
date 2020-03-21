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
            })
    })
});

