"use strict";
/*var oauth = require('../../oauth-electron-twitter/lib/local-oauth').oauth;
var twitter = require('../../oauth-electron-twitter/lib/local-oauth').twitter;*/

module.exports = class providerTwitter{
    constructor(){
        this.access_token = "";
        this.access_token_secret = "";
    }

    login(window)
    {
        /*return new Promise((resolve,reject) => {
            var ouath_twitter = new oauth().login(new twitter("Rh24sadwfFChzqf2fOv85Shg5","fPOPRUqPYMIx91OiMAZ5Sh1rRoZKp71wvSvVo8p2c88TDQla5J"), window)
            .then((result)=>{
                console.log("worked" + result.oauth_access_token + " "+result.oauth_access_token_secret);
                this.access_token = result.oauth_access_token;
                this.access_token_secret = result.oauth_access_token_secret;
                console.log("worked" + this.access_token + " "+this.access_token_secret);
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });*/
    }
};
