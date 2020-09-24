#!/usr/bin/env node
require('@babel/register')({
	presets: ['@babel/preset-env']
});
module.exports = require('./framework.js');
