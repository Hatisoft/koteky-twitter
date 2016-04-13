"use strict";

//var oauth   = require('electron-oauth-twitter');
var client = require('twitter');

module.exports = class providerTwitter{
    constructor(){
        this.accessToken = "";
        this.accessTokenSecret = "";
    }

    login()
    {
        /*var auth = new oauth({
          key: '***',
          secret: '***',
        });

        auth.startRequest().then(function(result) {
          this.accessToken = result.oauth_access_token;
          this.accessTokenSecret = result.oauth_access_token_secret;
        }).catch(function(error) {
          console.error(error, error.stack);
      });*/
    }
};
