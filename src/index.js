/*! Copyright (C) VanDerNorth - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and Confidential
 */

/**
 * @fileOverview
 * @author Jeffrey van Norden | Grexx <info@vandernorth.net>
 */

"use strict";
const _            = require('lodash'),
      path         = require('path'),
      express      = require('express');

class HttpServer {

    constructor( config, log ) {
        this.config = config;
        this.app    = express();

        this.app.enable('trust proxy');
        this.app.set('x-powered-by', false);
        
        this.app.listen(this.config.http.port);
        console.log('VDN-utils listening on port', this.config.http.port);

        let mapping = require('./services/_services.mapping');
        this.activateServices(mapping, '/');
        this.set404();
    }
    
    set404() {
        setTimeout(() => {
            this.app.use(( req, res ) => {
                console.info('404', req.url);
                res.statusCode = 404;
                res.json({ error: "unknown endpoint" });
            });
        }, 1000);
    }

    activateServices( services, path ) {
        this.activateService(services, path);
    }

    activateService( services, root ) {
        _.forEach(services, ( service, uriPath ) => {
            if ( typeof service === 'object' ) {
                this.activateServices(service, root + uriPath);
            } else {
                console.info('Activating', root, uriPath, 'with', service);
                let thisRouter = require(path.resolve(__dirname, 'services/', service));
                this.app.use(root + uriPath, thisRouter);
            }
        });
    }

}

module.exports = HttpServer;
