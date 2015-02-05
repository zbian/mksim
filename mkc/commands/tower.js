var mk_command = require('../mk_command')
var util = require('util')
var logger = require('../logger')
var get_card = require('../../data/get_card')

function load_tower(context, cmd, next) {
	logger.log(context,"开始刷"+cmd[1]+"塔");
	if (!context.data.user) { next(); return; }
        if (context.data.user.data.Energy < 2) {
		logger.error(context, "没体力");
		next();
		return;
	}
	if (context.data.tower && context.data.tower.error && context.data.tower.error.type == 4) {
		next();
		return;
        }
	mk_command('maze', context, {
		"mzsg":"do=Show",
		"MapStageId":parseInt(cmd[1]),
		"ncn":"100"
	},function(err, data){
		if (err || data.status != 1) {
			logger.error(context,JSON.stringify(data));
			next();
		}
		if (!context.data.tower) context.data.tower={};
		context.data.tower[cmd[1]] = data;

		if (data.data.Clear == 1 && data.data.FreeReset == 1) {
			reset_tower(context, cmd, next);
		} else if (data.data.Clear == 1) {
			logger.log(context,cmd[1]+"塔已经扫清");
			next();
		} else {
			info_layer(context, cmd, data.data, 1, next)
		}
	})
}

function reset_tower(context, cmd, next) {
	logger.log(context, "免费重置"+cmd[1]+"塔");
	mk_command('maze',context,{
		"mzsg":"do=Reset",
		"MapStageId":parseInt(cmd[1]),
		"ncn":"100"
	}, function(err, data){
		if (err || data.status != 1) {
			logger.error(context,JSON.stringify(data));
			next();
		} else {
			load_tower(context, cmd, next)
		}
	})
}

function info_layer(context, cmd, tower, layer, next) {
	mk_command('maze',context,{
		"mzsg":"do=Info",
		"MapStageId":parseInt(cmd[1]),
		"ncn":"100",
		"Layer":layer
	}, function(err, data){
		if (err || data.status != 1) {
			logger.error(context,JSON.stringify(data));
			next();
		} else {
			// load_tower(context, cmd, next)
			if (data.data.Map.IsFinish && data.data.RemainBoxNum == 0 && data.data.RemainMonsterNum == 0) {
				// next layer;
				layer++;
				if (layer > data.data.TotalLayer) {
					logger.log(context, cmd[1]+'塔已经扫清');
					next();
				} else {
					info_layer(context, cmd, tower, layer, next);
				}
			} else {
				var boxes = [], monsters = [];
				for(var i = 0; i< data.data.Map.Items.length; i++) {
					if (data.data.Map.Items[i] == 2)
						boxes.push(i);
					else if (data.data.Map.Items[i] == 3 || (data.data.Map.Items[i] == 5 && !data.data.Map.IsFinish))
						monsters.push(i);
				}
				do_battle(context, cmd, tower, layer, boxes, monsters, next);
			}
		}
	})
}
function do_battle(context, cmd, tower, layer, boxes, monsters, next){
	var item = null;
	if (boxes.length > 0) {
		item = boxes.pop();
	} else if (monsters.length > 0){
		item = monsters.pop();
	} else {
		info_layer(context, cmd, tower, layer, next)
		return;
	}
	mk_command('maze',context,{
		"mzsg":"do=Battle",
		"MapStageId":parseInt(cmd[1]),
		"ncn":"100",
		"Layer":layer,
		"manual":0,
		"ItemIndex":item,
		"OpenCardChip":1
	}, function(err, data){
		if (err || data.status != 1) {
			logger.error(context,JSON.stringify(data));
			context.data.tower.error = data;
			next();
		} else {
			if (data.data.Win != 1) {
				logger.log(context,"战斗失败，请检查卡组.");
				next();
			} else {
				var Award = data.data.ExtData.Award;
				console.log(Award);
				var card = get_card(Award.CardId || undefined).value();
				if (card && card.Color >= 4) {
					logger.green(context,"卡牌: " + card.CardName);
				}
				do_battle(context, cmd, tower, layer, boxes, monsters, next);
			}

		}
	})
}


module.exports = load_tower;
