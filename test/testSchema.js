'use strict';

module.exports = {
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