"use strict";

exports.__esModule = true;

var Router = require("@koa/router");

var passport = require("koa-passport"); // need to initialize the local auth strategy
// in controllers/auth.ts


var auth = require('../controllers/auth');

var router = new Router({
  prefix: '/auth'
});
router.get('/login', function (ctx) {
  return passport.authenticate('local', function (err, user) {
    if (!user) {
      ctx["throw"](401, err);
    } else {
      ctx.body = user;
      return ctx.login(user);
    }
  })(ctx);
});
/* Handle Oauth Login */
//.get('/google', passport.authenticate('google'))
//.get('/google/callback', passport.authenticate('google', {
//    successRedirect: '/google/success/',
//    failureRedirect: '/'
//}))

exports["default"] = router;
//# sourceMappingURL=auth.js.map
