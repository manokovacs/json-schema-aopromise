'use strict';

var tv4 = require('tv4');
var filter = require('json-schema-filter');
var Promise = Promise || require('bluebird');

module.exports = function JsonSchemaResultFilterAspect(schema, _options) {
	if (!schema) {
		throw new Error('Schema was not provided');
	}

	_options = _options || {};

	var options = {
		validate: _options.validate || false
	};

	this.post = function (opts) {
		if (options.validate) {
			var result = tv4.validateMultiple(opts.result, schema);
			if (!result.valid) {
				return Promise.reject(result.errors);
			}
		}
		return Promise.resolve({newResult: filter(schema, opts.result)});
	};
};