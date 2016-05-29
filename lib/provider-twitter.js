"use strict";
var oauth = require('oauth-electron-twitter').oauth;
var twitter = require('oauth-electron-twitter').twitter;
var twit = require('twit');
var post = require('koteky-lib').post;
var provider = require('koteky-lib').provider;
var FlowdockText = require("flowdock-text");

module.exports = class providerTwitter extends provider{
    constructor(){
        super();
        this.consumer_key = "Rh24sadwfFChzqf2fOv85Shg5";
        this.consumer_secret = "fPOPRUqPYMIx91OiMAZ5Sh1rRoZKp71wvSvVo8p2c88TDQla5J";
        this.tw = null;
    }

    onInitialize(context){
        this.posts = context.posts;
        if(!this.settings.tokens || !this.settings.tokens.access_token || !this.settings.tokens.access_token_secret){
            this.settings.tokens = {
                access_token: null,
                access_token_secret: null
            };
            return;
        }
        this.tw = new twit({
          consumer_key:         this.consumer_key,
          consumer_secret:      this.consumer_secret,
          access_token:         this.settings.tokens.access_token,
          access_token_secret:  this.settings.tokens.access_token_secret
        });
    }

    login(window)
    {
        return new Promise((resolve,reject) => {
            var ouath_twitter = new oauth().login(new twitter(this.consumer_key , this.consumer_secret), window)
            .then((result) => {
                this.settings.tokens.access_token = result.oauth_access_token;
                this.settings.tokens.access_token_secret = result.oauth_access_token_secret;
                this.tw = new twit({
                  consumer_key:         this.consumer_key,
                  consumer_secret:      this.consumer_secret,
                  access_token:         this.settings.tokens.access_token,
                  access_token_secret:  this.settings.tokens.access_token_secret
                });
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

    logout()
    {
        this.tw = undefined;
        this.access_token = undefined;
        this.access_token_secret = undefined;
        //TODO: make tokens invalid
    }

    hasAccess()
    {
        return new Promise((resolve,reject) => {
            if(!this.tw){
                reject();
            }
            this.tw.get('account/verify_credentials', { skip_status: true })
            .catch((err) => {
                reject();
            })
            .then((result) => {
                if(result.data.errors)
                    reject();
                resolve();
            });
        });
    }

    subscribe()
    {
        this.stream = this.tw.stream('user', { with: "followings", stringify_friend_ids: true });

        this.stream.on('tweet', (message) => {
            this.posts.push(new post(message.created_at, "Twitter", message.user.name, message.text));
        });
    }

    unsubscribe()
    {
        if(!this.stream)
            return;
        this.stream.stop();
    }

    retrieve(number, lastRetrieved)
    {
        var options = { count: number};
        if(lastRetrieved)
            options.max_id = lastRetrieved;

        this.tw.get('statuses/user_timeline', options , (error, messages) => {
            if(error)
                return;
            for (let message of messages) {
                /*jshint -W083 */
                this.posts.push(new post(message.created_at, "Twitter", message.user.name, FlowdockText.autoLink(message.text, { hashtagUrlBase: "http://twitter.com/hashtag/"})));
            }
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
