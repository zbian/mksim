var mk_command = require('../mk_command');
var logger = require('../logger');
var _ = require('underscore')._;

function show_map(context, cmd, next) {
	mk_command('mapstage', context, {
		"mzsg":"do=GetUserMapStages",
		"ncn":"100",
	},function(err, data){
		console.log(data)
		if (!err && data.status == 1) {
			context.data.map = data;
			context.data.map.TopLevelStage = (function(input){
				var stages = _.clone(input);
				_.each(stages, function(n){n.MapStageValue = n.MapStageId > 8 ? 8 : n.MapStageId});
				var lastStage = 
				_.chain(input)
				.groupBy(function(n){
					return n.MapStageValue
				})
				.pairs()
				.sortBy(function(n){
					return parseInt(n[0]);
				})
				.last()
				.value()[1];

				return _.chain(lastStage)
				.sortBy(function(n){return n.FinishedStage})
				.last()
				.value();
			})(data.data)
			next();
		}
		else next();
	})
}

module.exports = show_map;
