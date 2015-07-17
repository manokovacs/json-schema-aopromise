'use strict';


var aop = require('aopromise');
aop.register('validated', require('../lib/json-schema-aopromise').Validator);
aop.register('filtered', require('../lib/json-schema-aopromise').Filter);

var userSchema = getUserSchema();
var limitedUserSchema = getLimitedUserSchema();
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

userService.get = aop()
	.filtered(limitedUserSchema)
	.fn(function (id) {
		return {
			"id": id,
			"name": "Joe",
			"email": "secret@email.com" // this should be filtered out
		}
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
		return userService.save({
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
	})
	.then(function () {
		return userService.get(123).then(function(user){
			console.log(user);
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
			"email": {
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

function getLimitedUserSchema() {
	var userSchema = getUserSchema(); // implementation above
	delete userSchema.properties.email;
	return userSchema;
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