var util = require('util')
var logger = require('../logger')
module.exports = function(context, cmd, next) {
	for (var i=1; i < cmd.length; i++) {
		var v = cmd[i].split('.');
		var p = context.data;
		for (var j=0;j<v.length;j++)
			if (p[v[j]])
				p = p[v[j]];
			else {
				p = {}
			}
		logger.debug(context, util.inspect(p, {depth:null}).toString())
	}
	next();
}