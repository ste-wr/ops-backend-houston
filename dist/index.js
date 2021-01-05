"use strict";

exports.__esModule = true;

var express = require("express");

var session = require("express-session");

var passport = require("passport");

var util_1 = require("util");

var dataStore_1 = require("./controllers/dataStore");

var UsersRouter_1 = require("./routes/UsersRouter");

var IndexRouter_1 = require("./routes/IndexRouter");

var AuthenticationRouter_1 = require("./routes/AuthenticationRouter");

var UsersRouter_2 = require("./routes/UsersRouter");

var app = express();

var Settings = require('./settings');

var db = dataStore_1["default"].initDataStore();
var dataStoreGetAsync = util_1.promisify(db.get).bind(db);
module.exports = {
  dataStoreGetAsync: dataStoreGetAsync
};
var sess = {
  secret: 'keyboard cat',
  cookie: {
    secure: false
  }
};

if (Settings.env === "production") {
  app.set('trust proxy', 1); //trust first proxy

  sess.cookie.secure = true;
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

require('./controllers/auth'); // define all routes


app.use("/", IndexRouter_1["default"]);
app.use("/auth", AuthenticationRouter_1["default"]);
app.use("/users", UsersRouter_2["default"]); //last route

app.use("*", UsersRouter_1["default"]);
app.listen(Settings.port, function () {
  console.log("Listening on port " + Settings.port);
});
process.on('unhandledRejection', function (err) {
  console.error(err);
  process.exit(1);
});
//# sourceMappingURL=index.js.map
