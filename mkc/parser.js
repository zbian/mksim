var fs = require('fs')
var util = require('util')
util.debuglog = require('debuglog');

var _ = require('underscore')._
var http = require('http')
var Agent = require('agentkeepalive')
var tough = require('tough-cookie')
var logger = require('./logger')
var Cookie = tough.Cookie;

var PARSER = {
	'buildID': function(user, account) {
		return user.user + '-' + account.ID 
	},
	'buildIDWithContext': function(context){
		return PARSER.buildID(context.user, context.account)
	},
	'execute': function(user, account, cmd, cb) {
		console.log('EXECUTE',user,account,cmd);
		fs.readFile(__dirname+'/../storage/'+cmd[0]+".mkc", function(err, data){
			data = data.toString();
			console.log(data);
			for(var i=1;i<cmd.length;i++) {
				var regExp = new RegExp("\\{"+i+"\\}", "gi");
				data = data.replace(regExp, cmd[1])
			}

			if (err) {
				console.log("无法读取命令:" + cmd);
			} else {
				// console.log(data.toString());
				var cmds = 
				_.chain(data.toString().split("\n"))
				.compact()
				.map(function(n){return _.map(n.split(' '), function(j){return j.trim()});})
				.filter(function(n){return n[0][0] != '#'})
				.value()

				var context = {
					account: account,
					user: user,
					idx : 0,
					stack : [],
					cmds : cmds,
					data : {},
					httpAgent: new Agent({
						maxSockets: 100,
						maxFreeSockets: 10,
						timeout: 60000,
						keepAliveTimeout: 30000
					}),
					jar: new tough.CookieJar(),
					Cookie: Cookie,
					first: true,
					seq: Math.floor(Math.random() * 10000),
					parser: PARSER,
					end_cb: cb
				}
				function next(){
					context.idx ++ ;
					PARSER.run_command(context, next);
				}
				PARSER.run_command(context, next)
			}
		})
	},
	'commands' : {
		'login' : require('./commands/login'),
		'user': require('./commands/user'),
		'debug': require('./commands/debug'),
		'tower': require('./commands/tower'),
		'award': require('./commands/award')
	},
	'run_command' : function(context, next) {
		if (context.idx >= context.cmds.length) {
			logger.end(context);
			console.log("END");
			if (context.end_cb)
				context.end_cb()
			return;
		}
		var cmd = context.cmds[context.idx];
		var major = cmd[0].toLowerCase();

		if (PARSER.commands[major]) {
			console.log(
				"RUN",cmd)
			PARSER.commands[major](context, cmd, next);
		} else {
			console.log(
				"SKIP", cmd)
			next();
		}
	}
}
module.exports = PARSER;
