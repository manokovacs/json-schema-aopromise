'use strict';


var aop = require('aopromise');
aop.register('validated', require('../lib/json-schema-aopromise').Validator);

var userSchema = getUserSchema();
var credentialSchema = getCredentialSchema();

var userService = {};

userService.save = aop()
	.validated(userSchema)
	.fn(function (user) {
		// user object is valid
	});

userService.saveWithCredentials = aop()
	.validated(userSchema, credentialSchema)
	.fn(function (user, credentials) {
		// some more magic
	});

userService.save({
	"name": "John Doe",
	"gender": "male"
}).then(function () {
	console.log('Valid'); // will be called
}).catch(function (errs) {
	errs.forEach(function (e) {
		return console.error(e.message)
	});
})
	.then(function () {
		userService.save({
			"id": "invalidId", // not a number
			"name": "John Doe",
			"gender": "DUCK!" // not in enum
		}).then(function () {
			console.log('Valid');
		}).catch(function (errs) {
			errs.forEach(function (e) {
				return console.error(e.message)
			}); // will be called
		});
	});

function getUserSchema() {
	return {
		"title": "User schema",
		"type": "object",
		"properties": {
			"id": {
				"type": "integer"
			},
			"name": {
				"type": "string"
			},
			"gender": {
				"type": "string",
				enum: ['male', 'female']
			}

		},
		"required": ["name"]
	};
}

function getCredentialSchema() {
	var credentialSchema = {
		"title": "User credential",
		"type": "object",
		"properties": {
			"username": {
				"type": "string",
				"pattern": "^[a-zA-Z0-9_]{6,64}$"
			},
			"password": {
				"type": "string"
			}

		},
		"required": ["username", "password"]
	};
}