var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

module.exports = function(passport) {
    passport.use('login1', new LocalStrategy(function(username, password, done) {

        if(username === "bhavan@b.com" && password === "a"){
            done(null,{username:"bhavan@b.com",password:"a"});
        }
        else
            done(null,false);
    }));
}


