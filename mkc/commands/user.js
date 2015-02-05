var mk_command = require('../mk_command')
var logger = require('../logger')

module.exports = function(context, cmd, next) {
	mk_command('user', context, {
		"mzsg":"do=GetUserinfo&OpenCardChip=1&phpp=IOS&phpl=ZH_CN",
		"pvpNewVersion":1,
		"ncn":"100",
	},function(err, data){
		if (err || data.status != 1) {
			logger.error(context, JSON.stringify(data));
			context.data.user = {};
			next();
			return;
		}
		context.data.user = data;
		var user = data.data;
		logger.log(context, ' lv.'+user.Level+' 金币'+user.Coins+' 钻'+user.Cash+' 券'+user.Ticket+" 体力"+user.Energy);
		next();
	})
}
