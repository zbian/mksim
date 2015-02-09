module.exports = function(context, key) {
	
	if (key.length == 0)
		return "";
	if (key.length >= 2 && key[0] == '"' && key[key.length-1] == '"') {
		return key.substr(1,key.length-2);
	}

	var v = key.split('.');
	var p = context.data;
	for (var j=0;j<v.length;j++) {
		if (p[v[j]])
			p = p[v[j]];
		else {
			p = null;
		}
	}
	return p;
}
