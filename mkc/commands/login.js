var mk_pp = require('../mk_pp')
var mk_command = require('../mk_command')

module.exports = function(context, cmd, next) {
	mk_pp(context, function(){
		mk_command('login', context, {
			"mzsg":"do=PassportLogin",
			"time":context.server.timestamp,
			"UserName":context.server.source,
			"PP_timestamp":context.server.timestamp,
			"Password":context.server.U_ID,
			"key":context.server.key,
			"PP_GS_PORT":context.server.GS_PORT,
			"ppgamename":"CARD-IPHONE-CHS",
			"PP_source":context.server.userName,
			"PP_GS_IP":context.server.GS_IP,
			"newguide":1,
			"PP_GS_CHAT_IP":context.server.GS_CHAT_IP,
			"PP_friendCode":context.server.friendCode,
			"ncn":"100",
			"Devicetoken":"",
			"Origin":"",
			"IDFA":"",
			"PP_key":context.server.key,
			"PP_G_TYPE":context.server.G_TYPE,
			"Udid":context.macAddress,
			"PP_U_ID":context.server.U_ID,
			"PP_userName":context.server.userName,
			"PP_uEmailState":context.server.uEmailState,
			"PP_GS_CHAT_PORT":context.server.PP_GS_CHAT_PORT,
			"PP_GS_NAME":context.server.GS_NAME,
			"PP_GS_DESC":context.server.GS_DESC
		}, function(e,data){
			next();
		})
	})
}