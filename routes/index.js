var express = require('express');
var router = express.Router();
var nconf = require('nconf');
var _ = require('underscore')._;
var parser = require('../mkc/parser');
var logger = require('../mkc/logger')
var IoServer = require('./io')
/* GET home page. */
router.get('/', function(req, res, next) {
  nconf.file({file: __dirname + '/../storage/settings.json'})
  var usession = req.session.user;
  var user_setting = nconf.get(usession.user) || {};
  var accounts = _.chain(user_setting).values().sortBy(function(n){return n.enable}).value();
  res.render('index', { title: 'Express', currentUrl: req.path, accounts: accounts});
});

router.post('/account', function(req, res, next){
  nconf.file({file: __dirname + '/../storage/settings.json'})
  var q = req.body;
  var usession = req.session.user;
  var user_setting = nconf.get(usession.user) || {};
  var account_setting = user_setting[q.account];
  if (!account_setting) { account_setting = user_setting[q.account] = {} };
  account_setting.ID = q.account;
  account_setting.password = q.password;
  account_setting.enable = true;
  nconf.set(usession.user, user_setting);
  nconf.save(function(e){
    if (e) res.send({status:'BAD',e:e});
    else res.send({status:'OK'});
  })
});

router.get('/task', function(req, res, next){
  nconf.file({file: __dirname + '/../storage/settings.json'})
  var usession = req.session.user;
  var user_setting = nconf.get(usession.user) || {};
  var accounts = _.chain(user_setting).values().sortBy(function(n){return n.enable}).value();
  nconf.file({file:__dirname + "/../storage/mkscripts.json"})
  var mkscripts = nconf.get("scripts") || {};
  res.render('task', {title: 'Express', currentUrl: req.path, accounts: accounts, mkscripts: mkscripts, user: usession});
})

router.post('/task', function(req, res, next){
  nconf.file({file: __dirname + '/../storage/settings.json'})
  var usession = req.session.user;
  var user_setting = nconf.get(usession.user) || {};

  var u = usession
  console.log(req.body);
  var selected_accounts = typeof req.body.account == 'string' ? [req.body.account] : req.body.account;
  var accounts = _.chain(user_setting).filter(function(n){return _.indexOf(selected_accounts, n.ID) != -1}).values().sortBy(function(n){return n.enable}).value();
  console.log(accounts)
  var cmd = (req.body.script + ' ' + req.body.arguments).split(' ');
  // accounts.forEach(function(c){
  
  (function execute_next_cmd(acs,ptr) {
    if (ptr >= accounts.length)
      return;

    var c = acs[ptr];
    logger.subscribe(parser,u,c,function(msg,data){
      IoServer.emit(usession.user, data);
    })
    parser.execute(u,c,cmd, function(){execute_next_cmd(accounts,ptr+1)});    
  })(accounts, 0);

  res.send('{}');
})
module.exports = router;
