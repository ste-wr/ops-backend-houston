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

require('dotenv').config({
  path: require('find-config')('.env')
});

var Koa = require("koa");

var session = require("koa-session");

var bodyParser = require("koa-bodyparser");

var redisStore = require("koa-redis");

var cors = require("@koa/cors");

var passport = require("koa-passport");

var db = require("./models");

var auth_1 = require("./routes/auth");

var app = new Koa();

var init = function () {
  return __awaiter(void 0, void 0, void 0, function () {
    var corsOptions;
    return __generator(this, function (_a) {
      db.init();
      app.keys = [process.env.KOA_SESSION_SECRET];
      app.use(session({
        store: redisStore()
      }, app));
      corsOptions = {
        credentials: true,
        origin: "http://localhost:3000"
      };
      app.use(cors(corsOptions));
      app.use(function (ctx, next) {
        return __awaiter(void 0, void 0, void 0, function () {
          var error_1;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2,, 3]);

                return [4
                /*yield*/
                , next()];

              case 1:
                _a.sent();

                return [3
                /*break*/
                , 3];

              case 2:
                error_1 = _a.sent();
                ctx.status = error_1.status || 500;
                ctx.type = 'json';
                ctx.body = {
                  message: error_1.message,
                  type: error_1.type
                };
                ctx.app.emit('error', error_1, ctx);
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
      app.use(bodyParser());

      require('./controllers/auth');

      app.use(passport.initialize());
      app.use(passport.session());
      app.use(auth_1["default"].routes());
      app.use(auth_1["default"].allowedMethods());

      if (module.children) {
        app.listen(process.env.PORT || 3000);
        console.log('App listening on port 3000');
      }

      return [2
      /*return*/
      ];
    });
  });
};

process.on('unhandledRejection', function (err) {
  console.error(err);
  process.exit(1);
});
init();
//# sourceMappingURL=server.js.map
