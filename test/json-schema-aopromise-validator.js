'use strict';

var JsonSchemaValidatorAspect = require('../lib/JsonSchemaValidatorAspect');
var JsonSchemaResultFilterAspect = require('../lib/JsonSchemaResultFilterAspect');
var Promise = Promise || require('bluebird');
var sinon = require('sinon');
var should = require('should');
var aop = require('aopromise');

describe('json-schema-aopromise.validator', function () {
	var valid = {firstName: 'John', lastName: 'Dow!', shouldNot: 'see this!'};
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
				valid.should.equal(res);
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
				valid.should.not.equal(res);
				should.not.exist(res.shouldNot);
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

var schema = {
	"title": "Example Schema",
	"type": "object",
	"properties": {
		"firstName": {
			"type": "string"
		},
		"lastName": {
			"type": "string"
		},
		"age": {
			"description": "Age in years",
			"type": "integer",
			"minimum": 0
		},
		"general": {
			"type": "object",
			"required": false
		},
		"contacts": {
			"type": "array",
			"id": "http://jsonschema.net/contacts",
			"required": false,
			"items": {
				"type": "object",
				"id": "http://jsonschema.net/contacts/0",
				"required": false,
				"properties": {
					"phone": {
						"type": "string",
						"required": false
					}
				}
			}
		},
		"hobbies": {
			"type": "array",
			"required": false,
			"items": {
				"type": "string"
			}
		}
	},
	"required": ["firstName", "lastName"]
};