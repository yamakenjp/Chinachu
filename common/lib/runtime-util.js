'use strict';

const nodeUtil = require('node:util');

module.exports = Object.assign({}, nodeUtil, {
	log: (...args) => console.log(new Date().toISOString(), ...args),
	error: (...args) => console.error(...args)
});
