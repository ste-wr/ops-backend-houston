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
exports.authenticateUserToken = exports.getLoggedUser = void 0;

var passport = require("koa-passport");

var bcrypt = require("bcrypt");

var util_1 = require("util");

var google = require('googleapis').google;

var jwt = require('jsonwebtoken');

var client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');
var oauth2 = google.oauth2({
  auth: client,
  version: 'v2'
});

var LocalStrategy = require('passport-local').Strategy;

var models_1 = require("../models");

var getAsync = util_1.promisify(models_1.db.get).bind(models_1.db);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  return __awaiter(void 0, void 0, void 0, function () {
    var user_1, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2,, 3]);

          user_1 = null;
          return [4
          /*yield*/
          , getAsync('usersMockDatabase').then(function (users) {
            user_1 = JSON.parse(users).find(function (currUser) {
              return currUser.id === id;
            });
          })];

        case 1:
          _a.sent();

          if (user_1) {
            done(null, user_1);
          } else {
            done(null, false);
          }

          return [3
          /*break*/
          , 3];

        case 2:
          err_1 = _a.sent();
          done(err_1);
          return [3
          /*break*/
          , 3];

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
});
passport.use(new LocalStrategy(function (username, password, done) {
  return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          user = null;
          return [4
          /*yield*/
          , getAsync('usersMockDatabase').then(function (users) {
            var currUsers = JSON.parse(users);
            user = currUsers.find(function (currUser) {
              return currUser.email === username;
            });
          })];

        case 1:
          _a.sent();

          if (!user) {
            done({
              type: 'email',
              message: 'No such user found'
            }, false);
            return [2
            /*return*/
            ];
          }

          if (bcrypt.compareSync(password, user.password)) {
            done(null, {
              id: user.id,
              email: user.email,
              userName: user.userName
            });
          } else {
            done({
              type: 'password',
              message: 'Passwords did not match'
            }, false);
          }

          return [2
          /*return*/
          ];
      }
    });
  });
}));

var hashAndCreateJWT = function (access_token) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      console.log(err);
    } else {
      bcrypt.hash(access_token, salt, function (err, hash) {
        if (err) {
          console.log(err);
        } else {
          console.log(hash);
          return jwt.sign({
            access_token: hash
          }, process.env.JWT_SALT, {
            expiresIn: '3600s'
          });
        }
      });
    }
  });
};

var authenticateUserToken = function (payload) {
  return __awaiter(void 0, void 0, void 0, function () {
    var tokens, jwtObject, refresh_token, usr_info;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , client.getToken(payload.code)];

        case 1:
          tokens = _a.sent().tokens;
          client.setCredentials(tokens);
          jwtObject = hashAndCreateJWT(tokens.access_token);

          if (tokens.refresh_token) {
            refresh_token = tokens.refresh_token;
          } else {
            console.log("no refresh token in response object");
          }

          return [4
          /*yield*/
          , oauth2.userinfo.get(function (err, res) {
            if (err) {
              console.log(err);
            }
          })];

        case 2:
          usr_info = _a.sent();
          return [2
          /*return*/
          , usr_info];
      }
    });
  });
};

exports.authenticateUserToken = authenticateUserToken;

var getLoggedUser = function (ctx) {
  return __awaiter(void 0, void 0, void 0, function () {
    var reqUserId_1, user_2, statusCode;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!ctx.isAuthenticated()) return [3
          /*break*/
          , 2];
          reqUserId_1 = ctx.req.user.id;
          user_2 = null;
          return [4
          /*yield*/
          , getAsync('usersMockDatabase').then(function (users) {
            user_2 = JSON.parse(users).find(function (currUser) {
              return currUser.id === reqUserId_1;
            });
          })];

        case 1:
          _a.sent();

          if (user_2) {
            delete user_2.password;
            ctx.response.body = user_2;
          } else {
            statusCode = 500;
            ctx["throw"](statusCode, "User doesn't exist");
          }

          return [3
          /*break*/
          , 3];

        case 2:
          ctx.redirect('/');
          _a.label = 3;

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.getLoggedUser = getLoggedUser;
//# sourceMappingURL=auth.js.map
