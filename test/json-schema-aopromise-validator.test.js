'use strict';

var JsonSchemaValidatorAspect = require('../lib/JsonSchemaValidatorAspect');
var JsonSchemaResultFilterAspect = require('../lib/JsonSchemaResultFilterAspect');
var Promise = Promise || require('bluebird');
var sinon = require('sinon');
var should = require('should');
var aop = require('aopromise');
var schema = require('./testSchema');

describe('json-schema-aopromise.validator', function () {
	var valid = {firstName: 'John', lastName: 'Dow!'};
	var validWithDirt = {firstName: 'John', lastName: 'Dow!', shouldNot: 'see this!'};
	var invalid = {firstName: 'John', age: 'nonono'};

	before(function () {
		aop.register('validated', JsonSchemaValidatorAspect);
	});
	after(function () {
		aop.unregister('validator');
	});

	it('should accept valid first argument if one schema passed with valid data', function (end) {
		aop()
			.validated(schema)
			.fn(function(arg1) {
				return arg1;
			})(valid)
			.then(function (res) {
				JSON.stringify(valid).should.equal(JSON.stringify(res));
				end();
			})
			.catch(function (errs) {
				end(errs);
			});
	});

	it('should filter unmatched field if no option added', function (end) {
		aop()
			.validated(schema)
			.fn(function(arg1) {
				should.not.exist(arg1.shouldNot);
				return arg1;
			})(validWithDirt)
			.then(function (res) {
				should.not.exist(res.shouldNot);
				end();
			})
			.catch(function (errs) {
				end(errs);
			});

	});

	it('should not filter unmatched field if schema additonalProperties=true was set', function (end) {
		var schemaWithAdditionalProperties = Object.assign({additionalProperties: true}, schema);
		aop()
			.validated(schemaWithAdditionalProperties)
			.fn(function(arg1) {
				should.exist(arg1.shouldNot);
				return arg1;
			})(validWithDirt)
			.then(function (res) {
				should.exist(res.shouldNot);
				end();
			})
			.catch(function (errs) {
				end(errs);
			});

	});

	it('should not filter unmatched field if option.filter=false added', function (end) {
		new JsonSchemaValidatorAspect(schema, {filter: false})
			.pre({args: [validWithDirt]})
			.then(function (res) {
				res.should.not.have.property('newArguments');
				end();
			})
			.catch(function (errs) {
				end(errs);
			})
	});

	it('should reject invalid first argument if one schema passed', function (end) {
		new JsonSchemaValidatorAspect(schema)
			.pre({args: [invalid]})
			.then(function () {
				end(new Error('should have failed'));
			})
			.catch(function (errs) {
				end();
			})
	});

	it('should reject invalid second argument if two schema passed', function (end) {
		new JsonSchemaValidatorAspect([schema, schema])
			.pre({args: [valid, invalid]})
			.then(function () {
				end(new Error('should have failed'));
			})
			.catch(function (errs) {
				end();
			})
	});
});
