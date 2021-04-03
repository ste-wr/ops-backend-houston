"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

exports.__esModule = true;
exports.generateGoogleAuthURL = exports.authenticateUserToken = void 0;

var passport = require("koa-passport");

var bcrypt = require("bcrypt");

var google = require('googleapis').google;

var jwt = require('jsonwebtoken');

var models_1 = require("../models");

var client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CALLBACK_URL, 'postmessage');
var oauth2 = google.oauth2({
  auth: client,
  version: 'v2'
});
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

var getOrInsertUser = function (id) {
  return new Promise(function (resolve, reject) {
    var user = null;
    models_1.db.serialize(function () {
      models_1.db.get("SELECT * FROM user where google_id = ?", id, function (err, row) {
        if (err) {
          // database error
          console.error(err);
          reject(err);
        } else {
          if (!row) {
            models_1.db.run("INSERT INTO user(google_id) VALUES(?)", [id], function (err) {
              if (err) {
                console.error(err);
              }

              user = {
                id: this.lastID,
                google_id: id
              };
              resolve(user);
            });
          } else {
            user = {
              id: row.id,
              google_id: id
            };
            resolve(user);
          }
        }
      });
    });
  });
};

var insertUserAccessToken = function (user_id, token, expiry) {
  var epoch_expiry = expiry / 1000;
  models_1.db.run("INSERT INTO oauth_access_tokens(user_id, access_token, expiry_date) VALUES(?,?,?)", [user_id, token, epoch_expiry], function (err) {
    if (err) {
      console.error(err);
    }

    console.log("Inserted access token with lastID " + this.lastID);
  });
};

var insertUserRefreshToken = function (user_id, token) {
  models_1.db.run("INSERT INTO oauth_refresh_tokens(user_id, refresh_token) VALUES(?,?)", [user_id, token], function (err) {
    if (err) {
      console.error(err);
    }

    console.log("Inserted refresh token with lastID " + this.lastID);
  });
};

var generateGoogleAuthURL = function (ctx) {
  return __awaiter(void 0, void 0, void 0, function () {
    var payload, url;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          payload = {
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/userinfo.profile'
          };

          if (!ctx.cookies.get('__htsn_refresh_token')) {
            payload['prompt'] = 'consent';
          }

          return [4
          /*yield*/
          , client.generateAuthUrl(payload)];

        case 1:
          url = _a.sent();
          return [2
          /*return*/
          , url];
      }
    });
  });
};

exports.generateGoogleAuthURL = generateGoogleAuthURL;

var authenticateUserToken = function (ctx) {
  return __awaiter(void 0, void 0, void 0, function () {
    var payload, existingRefreshToken, data, tokens, userData;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          payload = ctx.request.body;
          existingRefreshToken = ctx.cookies.get('__hstn_refresh_token');
          data = null;
          return [4
          /*yield*/
          , client.getToken(payload.code)];

        case 1:
          tokens = _a.sent().tokens;
          client.setCredentials(tokens); // if there is no existing refresh token (cookie-based), and if there's no refresh token in the tokens object,
          // then we assume that this user has an existing refresh token for a different machine.  In this case, request a
          // new refresh token from google and store it for this client

          if (!existingRefreshToken && !tokens.refresh_token) {}

          return [4
          /*yield*/
          , oauth2.userinfo.get()];

        case 2:
          userData = _a.sent();
          if (!userData.data.id) return [3
          /*break*/
          , 4];
          return [4
          /*yield*/
          , getOrInsertUser(userData.data.id).then(function (user) {
            var hashedAccessToken = bcrypt.hashSync(tokens.access_token, 10);
            insertUserAccessToken(user.id, hashedAccessToken, tokens.expiry_date);
            var hashedRefreshToken = "";

            if (tokens.refresh_token) {
              hashedRefreshToken = bcrypt.hashSync(tokens.refresh_token, 10);
              insertUserRefreshToken(user.id, hashedRefreshToken);
            }

            data = JSON.stringify({
              access_token: jwt.sign({
                access_token: hashedAccessToken
              }, process.env.JWT_SALT, {
                expiresIn: '3600s'
              }),
              refresh_token: hashedRefreshToken
            });
          })];

        case 3:
          _a.sent();

          return [3
          /*break*/
          , 5];

        case 4:
          return [2
          /*return*/
          , null];

        case 5:
          return [2
          /*return*/
          , data];
      }
    });
  });
};

exports.authenticateUserToken = authenticateUserToken;
//# sourceMappingURL=auth.js.map
