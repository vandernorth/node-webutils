/*! Copyright (C) VanDerNorth - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and Confidential
 */

/**
 * @fileOverview
 * @author Jeffrey van Norden | Grexx <info@vandernorth.net>
 */

"use strict";
let HttpServer = require('../src/index'),
    config       = require('../config/config.js'),
    httpServer = new HttpServer(config);

module.exports = httpServer;
