'use strict';

var request              = require('superagent');
var R                    = require('ramda');
var nconf                = require('nconf');
var Spinner              = require('cli-spinner').Spinner;
var chalk                = require('chalk');
var path                 = require('path');
var autoremoteConfigFile = path.join(__dirname, 'autoremotekey.json');
var spinner              = new Spinner('getting info.. %s');
 
spinner.setSpinnerString('|/-\\');

nconf.argv()
     .env()
     .file({ file: autoremoteConfigFile });

var apiKey = nconf.get('apikey');
var config = nconf.get('config');

if(config) {
  var data = config.split('=');
  nconf.set(data[0], data[1]);
  nconf.save(function (err) {
    if(err) {
      throw new Error(err);
    }
  });
  console.log(chalk.green('settings updated'));
  return;
}

var mainUrl        = 'https://autoremotejoaomgcd.appspot.com/sendmessage';
var deviceKey      = apiKey;
var defaultMessage = {message:'testmessage=:=test', key: deviceKey};

function sendMessage(obj) {
  spinner.start();
  var newObj = R.merge(defaultMessage, obj);
  request
    .get(mainUrl)
    .query(newObj)
    .end(function(err,body){
      spinner.stop(true);
      if(err) {
        console.log(chalk.red(err));
      }
      console.log(chalk.green(body.text));
    });
} 

module.exports = sendMessage;

