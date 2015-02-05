var sys = require('sys')
var querystring = require('querystring');
var crypto = require('crypto')

var Buffer = require('buffer').Buffer;
var zlib = require('zlib');
var request = require('superagent');
var _ = require('underscore')._;

var base64_encode = function(data){
	return new Buffer(data, 'binary').toString('base64');
}

module.exports = function(api, context, data, next){
	data.mzsg += "&v=" + context.seq + "&phpp=IOS&phpl=ZH_CN";
	context.seq++;
	if (context.seq > 10000000) context.seq = 1;
	var jstr = JSON.stringify(data);
	var zd = zlib.deflate(jstr, function(e, result){
		var source = base64_encode(result);
		var n = Math.floor(Math.random()*5+5)
		var j = 0, prefix = "";
		for (j=0;j<5;j++) {
			prefix += String.fromCharCode(Math.random()*25+97)
		}
		prefix += n;
		for (j=0;j<n;j++){
			prefix += String.fromCharCode(Math.random()*25+97)
		}
		source = prefix + source;
		var s = source 
		+ String.fromCharCode(95,45,40,41,43)
		+ '15eb'+'f9a5'+'9893'+'a348'
		+ '09c3'+'573b'+'7051'+'f678';
		var md5hash = crypto.createHash('md5');
		md5hash.update(s);
		var signature = md5hash.digest('hex');
		var qo = {z: source, b: signature};
		var qs = querystring.stringify(qo);
		if (context.first) {
			request
			.post(context.server.GS_IP + api + '.php?' + data.mzsg + "&pvc=1.6.0&pvb=2014-12-31%2017%3A26%3A26")
			.agent(context.httpAgent)
			.set('User-Agent','Mozilla/5.0 (Windows; U; zh-CN) AppleWebKit/533.19.4 (KHTML, like Gecko) AdobeAIR/15.0')
			.set('x-flash-version','15,0,0,223')
			.set('Context-Type','application/x-www-form-urlencoded; charset=UTF-8')
			.set('Referer','app,/CardMain.swf')
			.send(querystring.stringify(_.omit(data, 'mzsg')))
			.end(function(e, res){
				if (res.header['set-cookie']) {
					context.jar.setCookie(context.Cookie.parse(res.header['set-cookie'].toString()), context.server.GS_IP, function(){
						context.first = false;
						next(e, JSON.parse(res.text || "{}"));
					})
				} else {
					context.first = false;
					next(e, JSON.parse(res.text || "{}"));
				}
			})
		} else {
			context.jar.getCookies(context.server.GS_IP, function(err, cookies){
				request
				.post(context.server.GS_IP + api + '.php?pvc=1.6.0&pvb=2014-12-31%2017%3A26%3A26')
				.agent(context.httpAgent)
				.set('User-Agent','Mozilla/5.0 (Windows; U; zh-CN) AppleWebKit/533.19.4 (KHTML, like Gecko) AdobeAIR/15.0')
				.set('x-flash-version','15,0,0,223')
				.set('Context-Type','application/x-www-form-urlencoded; charset=UTF-8')
				.set('Referer','app,/CardMain.swf')
				.set('Cookie', cookies.join('; '))
				.send(qs)
				.end(function(e, res){
					next(e, JSON.parse(res.text || "{}"));				
				})				
			})
		}
	})
}
