'use strict';

var JsonSchemaResultFilterAspect = require('../lib/JsonSchemaResultFilterAspect');
var Promise = Promise || require('bluebird');
var sinon = require('sinon');
var should = require('should');

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