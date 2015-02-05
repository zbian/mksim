var PubSub = require('pubsub-js')
function log_message(context, message) {
	if (context.data.user && context.data.user.data && context.data.user.data.NickName) {
		message = context.data.user.data.NickName+"(" + context.account.ID + ") - " + message;
	}
	console.log(message);
	PubSub.publish(context.user.user+'-'+context.account.ID, message);
}
module.exports = {
	log: log_message,
	info: function(c,m){log_message(c,"[INFO] "+m)},
	success: function(c,m){log_message(c,"<green>"+m+"</green>")},
	debug: function(c,m){log_message(c,"[DEBUG] "+m)},
	error: function(c,m){log_message(c,"<red>"+m+"</red>")},
	end: function(c){PubSub.publish(c.user.user+'-'+c.account.ID+':end','END')},
	subscribeWithContext: function(c,cb){
		PubSub.subscribe(c.parser.buildIDWithContext(context),cb)
	},
	subscribe: function(parser,u,c,cb){
          	PubSub.subscribe(u.user+'-'+c.ID+':end',function(msg,data){
          		console.log('END of ',u.user,c.ID);
          		PubSub.unsubscribe(u.user+'-'+c.ID);
          		PubSub.unsubscribe(u.user+'-'+c.ID+':end');
          	})
		PubSub.subscribe(parser.buildID(u,c),cb);
	},
        unsubscribe: function(parser,u,c){
          	PubSub.unsubscribe(u.user+'-'+c.ID);
          	PubSub.unsubscribe(u.user+'-'+c.ID+':end');
        }
}
