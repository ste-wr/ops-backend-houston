"use strict";

exports.__esModule = true;

var express_1 = require("express");

var router = express_1.Router();
router.route('/').get(function (req, res) {
  res.status(200).send('FINE');
});
exports["default"] = router;
//# sourceMappingURL=IndexRouter.js.map
