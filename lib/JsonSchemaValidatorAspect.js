'use strict';

var tv4 = require('tv4');
var assert = require('assert');
var filter = require('json-schema-filter');
var Promise = Promise || require('bluebird');

module.exports = JsonSchemaValidatorAspect;

function JsonSchemaValidatorAspect(_schemas, _options) {
	assert.ok(_schemas, "At least one schema must be provided");
	var schemas = _schemas;
	_options = _options || {};

	var options = {
		filter: _options.hasOwnProperty('filter') ? _options.filter : true
	};

	if (schemas.constructor !== Array) {
		schemas = [_schemas];
	}

	this.pre = function (opts) {
		var i, errs = [], newArgs, result;

		for (i in schemas) {
			result = tv4.validateMultiple(opts.args[i], schemas[i]);
			if (!result.valid) {
				errs = errs.concat(result.errors);
			}
		}
		if (errs.length > 0) {
			return Promise.reject(errs);
		}

		if (options.filter) {
			newArgs = opts.args.slice();
			for (i in schemas) {
				if (newArgs.hasOwnProperty(i)) {
					newArgs[i] = filter(schemas[i], newArgs[i]);
				}
			}
			return Promise.resolve({newArgs: newArgs});
		}

		return Promise.resolve({});
	};
}