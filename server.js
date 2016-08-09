var express = require('express');
var app = express();
var os = require('os').homedir();

var LEX = require('letsencrypt-express').testing();

// Change these two lines!
var DOMAIN = 'ec2-52-38-24-188.us-west-2.compute.amazonaws.com';
var EMAIL = 'kan@kanadachi.com';

var lex = LEX.create({
  configDir: require('os').homedir() + '/letsencrypt/etc'
, approveRegistration: function (hostname, approve) { // leave `null` to disable automatic registration
    if (hostname === DOMAIN) { // Or check a database or list of allowed domains
      approve(null, {
        domains: [DOMAIN]
      , email: EMAIL
      , agreeTos: true
      });
    }
  }
});

app.use(express.static('./client'));

lex.onRequest = app;

lex.listen([80], [443, 5001], function () {
  var protocol = ('requestCert' in this) ? 'https': 'http';
  console.log("Listening at " + protocol + '://ec2-52-38-24-188.us-west-2.compute.amazonaws.com:' + this.address().port);
});
