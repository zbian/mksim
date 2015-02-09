var mk_command = require('../mk_command')
var logger = require('../logger')
var context_data = require('../context_data')

module.exports = {
	if: function(context, cmd, next) {
		switch(cmd.length) {
			case 2:
			{
				var value = context_data(context,cmd[1]) ;
				context.stack.push({idx: context.idx, checker:function(){ return value;}})
			}
			break;
			case 3:
			{
				var left = context_data(context,cmd[1]);
				var right = context_data(context,cmd[2]);
				context.stack.push({idx: context.idx, checker: function(){
											console.log(left, right);
return left == right;
				}})
			}
			break;
			default:
		}
		next();
	},
	else: function(context, cmd, next){
		var item = context.stack[context.stack.length-1];
		if (item && item.checker) {
			var old_checker = item.checker;
			item.checker = function(){
				console.log(old_checker());

				return !old_checker()
			};
		}
		next();
	},
	elseif: function(context, cmd, next) {
		var item = context.stack[context.stack.length-1];
		console.log("ELSEIF",item)
		if (item && item.checker) {	
			switch(cmd.length) {
				case 2:
				{
					var value = context_data(context,cmd[1]) ;
					item.checker = function(){ 
						console.log(value);
						return value;
					}
				}
				break;
				case 3:
				{
					console.log('left',cmd[1],'right',cmd[2])
					var left = context_data(context,cmd[1]);
					var right = context_data(context,cmd[2]);
					item.checker = function(){
						console.log(left, right);
						return left == right;}
					}
					break;
					default:
				}
				next();
			}
		},
		endif: function(context, cmd, next){
			context.stack.pop();
			next();
		}
	}
