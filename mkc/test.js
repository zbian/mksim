var parser = require('./parser');
var logger = require('./logger')
var u = {user:"zhen"}, c = {ID:"zbianr4", password:"ererer12"}
logger.subscribe(parser,u,c,function(msg,data){
	console.log(msg,data);
})
parser.execute(
	u,
	c,
	["tower-one","6"]);