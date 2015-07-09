'use strict';

var tv4 = require('tv4');
var filter = require('json-schema-filter');
var Promise = Promise || require('bluebird');

module.exports = function JsonSchemaValidatorAspect(_schemas, _options) {
	var schemas = _schemas;
	_options = _options || {};

	var options = {
		filter: _options.hasOwnProperty('filter') ? _options.filter : true
	};

	if (schemas.constructor !== Array) {
		schemas = [_schemas];
	}

	this.pre = function (opts) {
		var i, errs = [], newArguments, result;

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
			newArguments = opts.args.slice();
			for (i in schemas) {
				if (newArguments.hasOwnProperty(i)) {
					newArguments[i] = filter(schemas[i], newArguments[i]);
				}
			}
			return Promise.resolve({newArguments: newArguments});
		}

		return Promise.resolve({});
	};
};