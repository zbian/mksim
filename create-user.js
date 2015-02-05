#!/bin/env node

var nconf = require('nconf');
var prog = require('commander');

prog
	.version('1.0.0')
	.option('-u, --user [value]', 'User')
	.option('-p, --password [value]', 'Password')
	.parse(process.argv);

nconf.file({file: __dirname + '/storage/global.json'});

var users = nconf.get('users') || {};

users[prog.user] = prog.password;

nconf.set('users', users);

nconf.save(function(e){
	console.log(e || "success.");
});

