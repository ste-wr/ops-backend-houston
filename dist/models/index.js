"use strict";

exports.__esModule = true;
exports.init = exports.db = void 0;

var redis = require("redis");

var db = redis.createClient();
exports.db = db;
db.on('error', function (err) {
  console.log("DB error " + err);
});

var init = function () {
  db.set('usersMockDatabase', JSON.stringify([{
    id: 1,
    email: 'root@houston.ops',
    password: '$2a$04$4yQfCo8kMpH24T2iQkw9p.hPjcz10m.FcWmgkOhkXNPSpbwHZ877S',
    userName: 'root'
  }]), redis.print);
};

exports.init = init;
//# sourceMappingURL=index.js.map
