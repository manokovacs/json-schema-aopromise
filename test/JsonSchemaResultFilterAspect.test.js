'use strict';

var JsonSchemaResultFilterAspect = require('../lib/JsonSchemaResultFilterAspect');
var Promise = Promise || require('bluebird');
var sinon = require('sinon');
var should = require('should');
var schema = require('./testSchema');

describe('JsonSchemaResultFilterAspect', function () {
	var valid = {firstName: 'John', lastName: 'Dow!', shouldNot: 'see this!'};
	var validWithDirt = {firstName: 'John', lastName: 'Dow!', shouldNot: 'see this!'};
	var invalid = {firstName: 'John', age: 'nonono'};


	it('should filter unmatched field', function (end) {
		new JsonSchemaResultFilterAspect(schema)
			.post({result: validWithDirt})
			.then(function (res) {
				res.should.have.property('newResult');
				should.not.exist(res.newResult.shouldNot);
				end();
			})
			.catch(function (errs) {
				end(errs);
			})
	});

});
