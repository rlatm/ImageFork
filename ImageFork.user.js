// ==UserScript==
// @name        ImageFork
// @description This script makes images viewing sites simpler
// @namespace   https://github.com/plsankar1996/ImageFork
// @homepage    https://github.com/plsankar1996/ImageFork
// @author      plsankar1996
// @version     1.5
// @downloadURL https://github.com/plsankar1996/ImageFork/raw/master/ImageFork.user.js
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at      document-start
// @include     */img-*.html
// @include     */imgs-*.html
// @include     */imgv-*.html
// @include     */site/v/*
// @include     *://picfox.org/share-*
// @include     *://blobopics.biz/share-*
// @include     *://avenuexxx.com/archives/*
// @include     *://imgclick.net/*
// @include     *://imggold.org/*
// @include     *://imgchili.net/*
// @include     *://imagetwist.com/*
// @include     *://imgskull.*
// @include     *://imghall.com/?v=*
// @include     *://www.imagepearl.com/*
// @include     *://*.imghost.top/*
// @include     *://imgking.xyz/*
// @include     *://imgazure.com/*
// @exclude     */images/*
// @exclude     */img/*
// @exclude     */images-*
// ==/UserScript==

var href = window.location.href;
var host = window.location.hostname;

var redirects = {
    items: [{
        find: "/imgs-",
        replace: "/imgv-"
    }, {
        find: "/?v=",
        replace: "/images/"
    }, {
        find: "iceimg.net/site/v/",
        replace: "imgfile.net/site/v/"
    }, {
        find: "pixsense.net/r/site/v/",
        replace: "imgfile.net/site/v/"
    }]
};

var replaces = {
    items: [{
        find: ".md",
        replace: ""
    }, {
        find: "/small/",
        replace: "/big/"
    }, {
        find: "thumb",
        replace: "image"
    }, {
        find: "p.jpeg",
        replace: ".jpeg"
    }]
};

var elemtntsToDeal = [
    'form[method=POST] input[type=submit]',
    'img#iimg',
    '#show_image',
    'img[src*="/uploads/big/"]',
    'img[src*="/upload/big/"]',
    '.code_image',
    'img[src*="/wp-content/uploads/"]',
    'a:has(img#myUniqueImg)',
    'img[src*="' + host + '/img/"]',
    'img[src*="' + host + '/images/"]',
    ".pic"
];

var elemtntsToRemove = 'head, header,#header,.header, script, noscript, meta, link, style, .menu, #menu, .logo, #logo, ul, li, footer, #footer, .footer, iframe, frame, #popup';

for (var i = redirects.items.length - 1; i >= 0; i--) {
    if (href.indexOf(redirects.items[i].find) > -1) {
        window.location.assign(href.replace(redirects.items[i].find, redirects.items[i].replace));
        break;
    }
}

document.addEventListener('beforeload', function(event) {
    $(elemtntsToRemove).remove();
}, true);

window.addEventListener('beforescriptexecute', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $(elemtntsToRemove).remove();
    $(e.target).remove();
}, true);

$(elemtntsToRemove).remove();

$(function() {
    
    $(elemtntsToRemove).remove();
    
    for (var i = elemtntsToDeal.length - 1; i >= 0; i--) {
        var el = $(elemtntsToDeal[i]);
        if (el.length) {
            if (el.is('img')) {
                open(el.attr('src'));
            } else if (el.is('a')) {
                open(el.attr('href'));
            } else if (el.is('input')) {
                el.click();
            }
            break;
        }
    }
});

function open(url) {
    for (var i = replaces.items.length - 1; i >= 0; i--) {
        url = url.replace(replaces.items[i].find, replaces.items[i].replace);
    }
    window.location.assign(url);
}
