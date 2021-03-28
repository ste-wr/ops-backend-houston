"use strict";

exports.__esModule = true;
exports.init = exports.db = void 0;

var sqlite = require("sqlite3");

var db = new sqlite.Database('config.db', function (err) {
  if (err) {
    console.error(err.message);
  }

  console.log('connected to database');
});
exports.db = db;
db.on('error', function (err) {
  console.log("DB error " + err);
});

var init = function () {
  db.parallelize(function () {
    db.run("CREATE TABLE user (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            google_id text, \n            CONSTRAINT google_id_unique UNIQUE (google_id)\n            )", function (err) {
      if (err) {// Table already created
      } else {
        console.log('table USER created');
      }
    });
    db.run("CREATE TABLE oauth_access_tokens (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            user_id INTEGER, \n            access_token TEXT,\n            expiry_date INTEGER\n            )", function (err) {
      if (err) {// Table already created
      } else {
        console.log('table oauth_access_tokens created');
      }
    });
    db.run("CREATE TABLE oauth_refresh_tokens (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            user_id INTEGER,\n            refresh_token TEXT\n            )", function (err) {
      if (err) {// Table already created
      } else {
        console.log('table oauth_refresh_tokens created');
      }
    });
  });
};

exports.init = init;
//# sourceMappingURL=index.js.map
