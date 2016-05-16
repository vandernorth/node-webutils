"use strict";
let HttpServer = require('../src/index'),
    config       = require('../config/config.js'),
    httpServer = new HttpServer(config);

module.exports = httpServer;
