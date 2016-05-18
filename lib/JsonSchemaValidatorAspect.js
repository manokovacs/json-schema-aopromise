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
        filter: _options.hasOwnProperty('filter') ? _options.filter : null
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
        var filtered = false;
        newArgs = [];
        for (i in schemas) {
            var doFilter = options.filter !== null // if filter was defined
                ? options.filter // use the value
                : !schemas[i].additionalProperties; // else, use the additionalProperties value's negate
            if (doFilter && opts.args.hasOwnProperty(i)) {
                newArgs[i] = filter(schemas[i], opts.args[i]);
                filtered = true;
            }
        }
        if (filtered) {
            return Promise.resolve({newArgs: newArgs});
        } else {
            return Promise.resolve({});
        }

    };
}