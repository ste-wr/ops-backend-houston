"use strict";

exports.__esModule = true;

var passport = require("passport");

var GithubStrategy = require('passport-github2').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(new GithubStrategy({
  clientID: '6a1aa44e973e9ac0c1ca',
  clientSecret: '13897cd806820028a5d54610454674a553eb28c9',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    console.log(profile);
    return done(null, profile);
  });
}));
//# sourceMappingURL=auth.js.map
