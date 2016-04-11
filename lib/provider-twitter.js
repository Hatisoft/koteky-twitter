"use strict";

var oauth   = require('electron-oauth-twitter');
var client = require('twitter');

module.exports = class providerTwitter{
    constructor(){
        this.accessToken = "";
        this.accessTokenSecret = "";
    }

    login()
    {
        var auth = new oauth({
          key: 'Rh24sadwfFChzqf2fOv85Shg5',
          secret: 'fPOPRUqPYMIx91OiMAZ5Sh1rRoZKp71wvSvVo8p2c88TDQla5J',
        });

        auth.startRequest().then(function(result) {
          var accessToken = result.oauth_access_token;
          var accessTokenSecret = result.oauth_access_token_secret;
        }).catch(function(error) {
          console.error(error, error.stack);
        });
    }
};
