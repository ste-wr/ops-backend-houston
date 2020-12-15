"use strict";

exports.__esModule = true;

var express_1 = require("express");

var router = express_1.Router();
router.route('*').get(function (req, res) {
  res.status(200).send({
    "statusMessage": "OK",
    "requestQuery": req.query
  });
});
router.route('*').post(function (req, res) {
  res.status(200).send({
    "statusMessage": "OK",
    "requestParams": req.params
  });
});
exports["default"] = router;
//# sourceMappingURL=DefaultRouter.js.map
