var mk_command = require('../mk_command')
var logger = require('../logger')

module.exports = {
	login: function(context, cmd, next) {
		mk_command('arenaking', context, {
			"mzsg":"do=EnterGame",
			"pvpNewVersion":1,
			"ncn":"100",
		},function(err, data){
			if (err || data.status != 1) {
				logger.error(context, JSON.stringify(data));
				context.data.arenaking = {};
				next();
				return;
			}
			context.data.arenaking = data;
			next();
		})
	},
	info: function(context, cmd, next) {
		mk_command('arenaking', context, {
			"mzsg":"do=UserArenaInfo",
			"ncn":"100",
		},function(err, data){
			if (err || data.status != 1) {
				logger.error(context, JSON.stringify(data));
				context.data.arenaking = {};
				next();
				return;
			}
			context.data.arenaking.info = data;
			var info = data.data;
			logger.log(context, info.Score+"分,排名:"+info.Rank+"，当前卡组:"+info.GroupId);
			next();
		})
	},
	switch: function(context, cmd, next) {
		mk_command('arenaking', context, {
			"mzsg":"do=SwitchGroup",
			"ncn":"100",
			"GroupId":parseInt(cmd[1])
		},function(err, data){
			if (err || data.status != 1) {
				logger.error(context, JSON.stringify(data));
				next();
				return;
			}
			logger.log(context, "切换卡组完成!");
			next();
		})
	},

}
