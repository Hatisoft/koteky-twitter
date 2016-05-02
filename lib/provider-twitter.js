"use strict";
var oauth = require('oauth-electron-twitter').oauth;
var twitter = require('oauth-electron-twitter').twitter;
var twit = require('twit');
var post = require('koteky-lib').post;

module.exports = class providerTwitter{
    constructor(posts){
        this.posts = posts;
        this.access_token = "";
        this.access_token_secret = "";
        this.consumer_key = "Rh24sadwfFChzqf2fOv85Shg5";
        this.consumer_secret = "fPOPRUqPYMIx91OiMAZ5Sh1rRoZKp71wvSvVo8p2c88TDQla5J";
        this.tw = null;
    }

    login(window)
    {
        return new Promise((resolve,reject) => {
            var ouath_twitter = new oauth().login(new twitter(this.consumer_key , this.consumer_secret), window)
            .then((result) => {
                this.access_token = result.oauth_access_token;
                this.access_token_secret = result.oauth_access_token_secret;
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

    subscribe()
    {
        this.tw = new twit({
          consumer_key:         this.consumer_key,
          consumer_secret:      this.consumer_secret,
          access_token:         this.access_token,
          access_token_secret:  this.access_token_secret
        });

        var stream = this.tw.stream('user', { with: "followings", stringify_friend_ids: true });

        stream.on('message', (message) => {
            if(!message.created_at)
                return;
            this.posts.push(new post(message.created_at, "Twitter", message.user.name, message.text));
        });
    }

    post(message)
    {
        return new Promise((resolve,reject) => {
            this.tw.post('statuses/update', { status: message }, (error, result, response) => {
                if(error)
                    reject(error);
                resolve(result);
            });
        });
    }
};
