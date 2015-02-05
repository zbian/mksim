module.exports = {
	io: null,
	init: function(io){
		this.io = io;
	},
	emit: function(c,msg){
		this.io.emit(c,msg)
	},
	connect: function(sockets){
		console.log('a user conncted');
		sockets.on('disconnect',function(){
			console.log('user disconnect');
		})
	}
};