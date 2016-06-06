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
        this.last = null;
    }

    get name(){
        return "Twitter";
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
                resolve({initialized: true});
            }).catch((error) => {
                reject({initialized: false, message: error});
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
                reject({valid_tokens: false, message: 'No user tokens set'});
            }
            this.tw.get('account/verify_credentials', { skip_status: true })
            .catch((err) => {
                reject({valid_tokens: false, message: 'API call error'});
            })
            .then((result) => {
                if(result.data.errors)
                    reject({valid_tokens: false, message: 'tokens are invalid'});
                resolve({valid_tokens: true});
            });
        });
    }

    subscribe()
    {
        this.stream = this.tw.stream('user', { with: "followings", stringify_friend_ids: true });
        this.stream.on('tweet', (message) => {
            this._addMessage(message);
        });
    }

    unsubscribe()
    {
        if(!this.stream)
            return;
        this.stream.stop();
    }

    retrieve(number)
    {
        var options = {count: number};
        if(this.last)
            options.max_id = this.last.id-1;

        this.tw.get('statuses/home_timeline', options , (error, messages) => {
            if(error)
                throw error;
            for (let message of messages) {
                this._addMessage(message);
                this.last = message;
            }
        });
    }

    _addMessage(message)
    {
        var formatedMessage =   '<div class="twitter-message-container">'+
                                    '<divclass="twitter-message twitter-inner">'+
                                        FlowdockText.autoLink(message.text, { hashtagUrlBase: "http://twitter.com/hashtag/"})+
                                    '<div>' +
                                    '<divclass="twitter-actions twitter-inner">'+
                                        ' <a href="https://twitter.com/intent/retweet?tweet_id='+message.id_str+'" ><i class="fa fa-retweet" aria-hidden="true"></i></a>'+
                                    '<div>' +
                                '</div>';
        this.posts.push(new post(Date.parse(message.created_at), "Twitter", message.user.name, formatedMessage));
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
