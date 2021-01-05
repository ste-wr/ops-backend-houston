"use strict";

exports.__esModule = true;

var express_1 = require("express");

var passport = require("passport");

var router = express_1.Router();
router.route('/error').get(function (req, res) {
  res.status(401).send('Error');
});
router.route('/logout').get(function (ctx) {
  ctx.logout();
  ctx.body = {};
});
router.route('/github').get(passport.authenticate('github', {
  scope: ['user:email']
}));
router.route('/github/callback').get(passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/auth/error'
}));
exports["default"] = router;
//# sourceMappingURL=AuthenticationRouter.js.map
