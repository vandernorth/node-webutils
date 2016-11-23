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
      https   = require('https'),
      express = require('express');
let router    = express.Router();

router.get('/:account', ( req, res ) => {
    getFeed(req.params.account)
        .then(feed => {
            var images = _.map(feed.items, i => {
                    i.caption = i.caption || { text: "#taxithor" };
                    return ` <a href="${i.link}" target="_blank" class="">
                                <img src="${i.images.thumbnail.url}" alt="${i.caption.text}" title="${i.caption.text}">
                            </a>`
                }),
                html   = `<!DOCTYPE html>
                            <html lang="en">
                              <head>
                                <meta charset="utf-8">
                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <title>Instagram @${req.params.account}</title>
                              </head>
                              <body>
                               <div class="row"> ${images.join('')}</div>
                              </body>
                            </html>`;
            res.contentType('text/html');
            res.end(html);
        })
        .catch(error=> {
            console.error('FeedError', error);
            res.end('<!-- Error while reading instagram feed -->');
        })
});

function getFeed( account ) {
    return new Promise(( resolve, reject )=> {

        https.get(`https://www.instagram.com/${account}/media/`, ( res ) => {
            let stringData = '';

            res.on('data', ( d ) => {
                stringData += d;
            });

            res.on('end', () => {
                let thisJson = JSON.parse(stringData);
                resolve(thisJson);
            });

        }).on('error', ( e ) => {
            reject(e);
        });
    });
}

module.exports = router;
