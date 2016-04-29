"use strict";
var oauth = require('oauth-electron-twitter').oauth;
var twitter = require('oauth-electron-twitter').twitter;
var Twit = require('twit');

module.exports = class providerTwitter{
    constructor(){
        this.access_token = "";
        this.access_token_secret = "";
    }

    login(window)
    {
        return new Promise((resolve,reject) => {
            var ouath_twitter = new oauth().login(new twitter("Rh24sadwfFChzqf2fOv85Shg5","fPOPRUqPYMIx91OiMAZ5Sh1rRoZKp71wvSvVo8p2c88TDQla5J"), window)
            .then((result)=>{
                this.access_token = result.oauth_access_token;
                this.access_token_secret = result.oauth_access_token_secret;
                var T = new Twit({
                  consumer_key:         "Rh24sadwfFChzqf2fOv85Shg5",
                  consumer_secret:      "fPOPRUqPYMIx91OiMAZ5Sh1rRoZKp71wvSvVo8p2c88TDQla5J",
                  access_token:         this.access_token,
                  access_token_secret:  this.access_token_secret,
                  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
                });
                var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ];

                var stream = T.stream('statuses/filter', { locations: sanFrancisco });

                stream.on('message', function (msg) {
                    console.log(msg);
                });
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }
};
