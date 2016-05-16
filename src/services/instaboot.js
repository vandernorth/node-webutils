/*! Copyright (C) Grexx - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and Confidential
 */

/**
 * @fileOverview
 * @author Jeffrey van Norden | Grexx <jeffrey@grexx.net>
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
                    return `
  <!--div class="col-xs-6 col-md-2"-->
    <a href="${i.link}" target="_blank" class="">
        <img src="${i.images.thumbnail.url}" alt="${i.caption.text}" title="${i.caption.text}">
    </a>
  <!--/div-->`
                }),
                html   = `
 <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Instagram @${req.params.account}</title>

    <!-- Bootstrap -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
   <div class="row"> ${images.join('')}</div>
  </body>
</html>`;
            res.end(html);
        })
        .catch(error=> {
            console.error('FeedError', error);
            res.end('<!-- Error while reading feed -->');
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
