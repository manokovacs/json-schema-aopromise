'use strict';

var JsonSchemaValidatorAspect = require('../lib/JsonSchemaValidatorAspect');
var JsonSchemaResultFilterAspect = require('../lib/JsonSchemaResultFilterAspect');
var ValidationError = require('../lib/ValidationError');
var Promise = Promise || require('bluebird');
var sinon = require('sinon');
var should = require('should');
var aop = require('aopromise');
var schema = require('./testSchema');

describe('json-schema-aopromise.filter', function () {
	var valid = {firstName: 'John', lastName: 'Dow!', shouldNot: 'see this!'};
	var validWithDirt = {firstName: 'John', lastName: 'Dow!', shouldNot: 'see this!'};
	var invalid = {firstName: 'John', age: 'nonono'};

	before(function () {
		aop.register('filter', JsonSchemaResultFilterAspect);
	});
	after(function () {
		aop.unregister('filter');
	});

	it('should filter non-schema fields', function (end) {
		aop()
			.filter(schema)
			.fn(function () {
				return validWithDirt;
			})()
			.then(function (res) {
				res.should.have.property('firstName');
				res.should.not.have.property('shouldNot');
				end();
			})
			.catch(function (errs) {
				end(errs);
			});
	});

	it('should be invalid with invalid result and validate setting', function (end) {
		aop()
			.filter(schema, {validate: true})
			.fn(function () {
				return invalid;
			})()
			.then(function (res) {
				end(new Error('should not be valid'))
			})
			.catch(ValidationError, function (errs) {
				should(errs.validationErrors.length >= 2).be.true();
				end();
			})
			.catch(end);
	});

});
