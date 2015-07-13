'use strict';

var JsonSchemaValidatorAspect = require('../lib/JsonSchemaValidatorAspect');
var JsonSchemaResultFilterAspect = require('../lib/JsonSchemaResultFilterAspect');
var Promise = Promise || require('bluebird');
var sinon = require('sinon');
var should = require('should');
var aop = require('aopromise');

describe.only('json-schema-aopromise.filter', function () {
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

	it.only('should be invalid with invalid result and validate setting', function (end) {
		aop()
			.filter(schema, {validate: true})
			.fn(function () {
				return invalid;
			})()
			.then(function (res) {
				end(new Error('should not be valid'))
			})
			.catch(function (errs) {
				should(errs.length >= 2).be.true();
				end();
			});
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