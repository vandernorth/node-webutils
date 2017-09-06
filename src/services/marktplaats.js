/*! Copyright (C) VanDerNorth - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and Confidential
 */

/**
 * @fileOverview
 * @author Jeffrey van Norden | Grexx <info@vandernorth.net>
 */

"use strict";
const _       = require('lodash'),
      http    = require('https'),
      cheerio = require('cheerio'),
      express = require('express');
let router    = express.Router();

router.get('/:account', ( req, res ) => {
    getList()
        .then(list => {
            let page = cheerio.load(list);
            page('body').replaceWith(`<section class="search-results-table table">${page('.search-results-table').html()}</section>`);
            res.contentType('text/html');
            res.end(page.html());
        })
        .catch(error => {
            res.contentType('text/html');
            res.end(`<!-- Error: ${error}-->`);
        });
});

function getList( account ) {
    return new Promise(( resolve, reject )=> {
        account = 18756775;
        http.get(`https://www.marktplaats.nl/verkopers/${account}.html?view=lr`, ( res ) => {
            let stringData = '';
            res.on('data', ( d ) => stringData += d);
            res.on('end', () => resolve(stringData));
        }).on('error', reject);
    });
}

module.exports = router;
