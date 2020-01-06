'use strict';

const request = require('supertest');
var app = require('../index.js');

describe('Tests index', function () {
  it('verifies successful response', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });
});
