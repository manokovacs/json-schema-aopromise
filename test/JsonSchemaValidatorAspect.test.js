'use strict';

var JsonSchemaValidatorAspect = require('../lib/JsonSchemaValidatorAspect');
var Promise = Promise || require('bluebird');
var sinon = require('sinon');
var should = require('should');
var schema = require('./testSchema');

describe('JsonSchemaValidatorAspect', function () {
    var valid = {firstName: 'John', lastName: 'Dow!', shouldNot: 'see this!'};
    var validWithDirt = {firstName: 'John', lastName: 'Dow!', shouldNot: 'see this!'};
    var invalid = {firstName: 'John', age: 'nonono'};

    it('should accept valid first argument if one schema passed with valid data', function (end) {
        new JsonSchemaValidatorAspect(schema)
            .pre({args: [valid]})
            .then(function () {
                end();
            })
            .catch(function (errs) {
                end(errs);
            })
    });

    it('should filter unmatched field if no option added', function (end) {
        new JsonSchemaValidatorAspect(schema)
            .pre({args: [validWithDirt]})
            .then(function (res) {
                res.should.have.property('newArgs');
                should.exist(res.newArgs[0]);
                should.not.exist(res.newArgs[0].shouldNot);
                end();
            })
            .catch(function (errs) {
                end(errs);
            })
    });

    it('should not filter unmatched field if option.filter=false added', function (end) {
        new JsonSchemaValidatorAspect(schema, {filter: false})
            .pre({args: [validWithDirt]})
            .then(function (res) {
                res.should.not.have.property('newArgs');
                end();
            })
            .catch(function (errs) {
                end(errs);
            })
    });

    it('should not filter unmatched field if schema additionalProperties=true added', function (end) {
        var schemaWithAdditionalProperties = Object.assign({additionalProperties: true}, schema);
        new JsonSchemaValidatorAspect(schemaWithAdditionalProperties)
            .pre({args: [validWithDirt]})
            .then(function (res) {
                res.should.not.have.property('newArgs');
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
