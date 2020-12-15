"use strict";

require('dotenv').config({
  silent: true
});

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development"
};
//# sourceMappingURL=settings.js.map
