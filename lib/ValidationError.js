'use strict';

var errors = require('errors');
var ValidationError = module.exports = errors.create({
    name: "ValidationError",
    defaultMessage: "Validation of arguments failed.",
    code: 422
});

ValidationError.fromErrors = function (errors) {
    return new ValidationError({
        explanation: errors.map(function (err) {
            return (err.dataPath ? err.dataPath + ": " : "") + err.message;
        }).join("\n"),
        validationErrors: errors
    });
};