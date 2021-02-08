"use strict";

exports.__esModule = true;

var Router = require("@koa/router");

var passport = require("koa-passport");

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
exports["default"] = router;
//# sourceMappingURL=auth.js.map
