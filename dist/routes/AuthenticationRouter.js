"use strict";

exports.__esModule = true;

var express_1 = require("express");

var passport = require("passport");

var router = express_1.Router();
router.get('/auth/error', function (req, res) {
  res.status(401).send('Error');
});
router.get('/auth/github', passport.authenticate('github', {
  scope: ['user:email']
})).get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/auth/error'
}));
exports["default"] = router;
//# sourceMappingURL=AuthenticationRouter.js.map
