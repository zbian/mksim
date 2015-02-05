var mk_command = require('../mk_command')
var logger = require('../logger')
var get_card = require('../../data/get_card')

var awardTypes = {
	'1': '金币',
	'2': '钻石'
}
function pick_award(context, cmd, next) {
	mk_command('user', context, {
		"mzsg":"do=AwardSalary",
		"ncn":"100",
	},function(err, data){
		console.log(err, data);
		if (!err && data.status == 1) {
			logger.log(context,"奖励领取成功！" );
			next();
		}
		else next();
	})
	next();
}
function show_award(context, cmd, next) {
	mk_command('user', context, {
		"mzsg":"do=GetUserSalary",
		"ncn":"100",
	},function(err, data){
		if (!err && data.status == 1) {
			data.data.SalaryInfos.forEach(function(award){
				console.log(award);
				logger.log(context,"奖励："+ (awardTypes[award.AwardType] || award.AwardType) + (award.AwardValue ? award.AwardValue : JSON.stringify(award)) )
			})
			if (data.data.SalaryInfos.length > 0)
				pick_award(context, cmd, next)
			else
				next();
		}
		else next();
	})
}

module.exports = show_award;