var express = require('express');
var router = express.Router();
var nconf = require('nconf');

router.get('/', function(req, res, next){
  res.render('login');
})

router.post('/', function(req, res, next) {
  nconf.file({file: __dirname + '/../storage/global.json'});
  var q = req.body;
  var users = nconf.get('users');
  if (users[q.user] && users[q.user] == q.password) { 
    req.session.user = q;
    res.redirect('/');
  }
  else {
//    req.session.destroy(function(){
//      res.redirect('/login');
//    });
  }
})

module.exports = router;

