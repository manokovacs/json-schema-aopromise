'use strict';

var AspectFrame = require('aopromise').AspectFrame;

var aopJsonschema = {
	Aspect: function Aspect(schema) {
		return new AspectFrame(
			function (preOpts) {
				preOpts.args[0];
			},
			function () {

			}
		);
	}
};

module.exports = aopJsonschema;