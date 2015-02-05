var request = require('request')
var getmac = require('getmac');

function buildPara(context){
	return new Buffer(JSON.stringify({
		userName: context.account.ID,
		userPassword: context.account.password,
		gameName: 'CARD-IPHONE-CHS',
		udid: context.data.macAddress,
		idfa: '',
		clientType: 'flash',
		releaseChannel: '',
		locale: 'chs'
	})).toString('base64')
}

module.exports = function(context, next) {
	getmac.getMac(function(err,macAddress){
		if (err) {
			context.err = err;
			return;
		}
		context.data.macAddress = macAddress;
		request({
			url: 'http://bj.muhepp.com/pp/httpService.do',
			method: 'POST',
			headers: {
				'User-Agent':'Mozilla/5.0 (Windows; U; zh-CN) AppleWebKit/533.19.4 (KHTML, like Gecko) AdobeAIR/15.0',
				'x-flash-version':'15,0,0,223',
				'Context-Type':'application/x-www-form-urlencoded; charset=UTF-8',
				'Referer':'http://bj.muhepp.com/pp/start.do?udid=74-E5-43-C2-3D-DB&idfa=&locale=CHS&gameName=CARD-IPHONE-CHS&client=flash',
				'X-Requested-With':'XMLHttpRequest',
				'Origin':'http://bj.muhepp.com'
			},
			body:JSON.stringify({"serviceName":"checkUserActivedBase64Json","callPara":buildPara(context)}),
		}, function(err, res, body){
			var body = JSON.parse(body);
			if (body.returnCode == "0") {
				context.server = body.returnObjs;
				next();
			} else {
				context.err = "mk_pp:" + body.returnCode;
			}
		})
	})
}