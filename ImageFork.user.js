// ==UserScript==
// @name        ImageFork
// @description This script makes images viewing sites simpler
// @namespace   https://github.com/plsankar1996/ImageFork
// @homepage    https://github.com/plsankar1996/ImageFork
// @author      plsankar1996
// @version     1.9.2
// @downloadURL https://github.com/plsankar1996/ImageFork/raw/master/ImageFork.user.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at      document-start
// @include     *://plsankar1996.github.io/ImageFork/config.html
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
// @include     *://imgking.xyz/*
// @include     *://imgazure.com/*
// @include     *://imgur.com/*
// @include     *://shaggyimg.pro/*
// @include     *://imgtorrnt.in/view.php?id=*
// @include     *://www.imagepearl.com/*
// @include     *://*.imghost.top/*
// @include     *://*.imagevenue.com/img.php?*
// @include     *://xxxhost.me/viewer.php?file=*
// @include     *://imgsmarts.info/*
// @include     *://picbaron.com/*
// @include     *://imgbaron.com/*
// @include     *://imgmercy.com/*
// @include     *://dailyimages.xyz/*
// @include     *://imgspice.com/*
// @exclude     */images/*.jpg
// @exclude     */img/*
// @exclude     */images-*
// @match     *://trans.firm.in/*
// ==/UserScript==

var href = window.location.href;
var host = window.location.hostname;
var sites = 'sites';
var $ = window.jQuery;
var iscontrolpage = host == 'plsankar1996.github.io';

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
    }, {
        find: "imgtorrnt.in/view.php?id=",
        replace: "i.imgur.com/"
    }, {
        find: "xxxhost.me/viewer.php?file=",
        replace: "xxxhost.me/files/"
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
    }, {
        find: "?fb",
        replace: ""
    }]
};

var elemtntsToDeal = [
    'meta[property*="og:image"]',
    'img[src*="' + host + '/uploads/big/"]',
    'img[src*="' + host + '/upload/big/"]',
    'img[src*="' + host + '/img/"]',
    'img[src*="' + host + '/images/"]',
    'img[src*="' + host + '/wp-content/uploads/"]',
    'img#iimg',
    'img#myImg',
    '.centred',
    '.centred_resized',
    '#show_image',
    '.code_image',
    '#thepic',
    'a:has(img#myUniqueImg)',
    ".pic",
    'form[method=POST] input[type=submit]'
];

var elemtntsToRemove = 'header, #header, .header, script, noscript, link, style, .menu, #menu, .logo, #logo, ul, li,.login_cuerpo, footer, #footer, .footer, iframe, frame, #popup, .ads,#ads, .navbar';

if (!iscontrolpage) {

    saveWebsiteToList();

    for (var i = redirects.items.length - 1; i >= 0; i--) {
        if (href.indexOf(redirects.items[i].find) > -1) {
            window.location.assign(href.replace(redirects.items[i].find, redirects.items[i].replace));
            break;
        }
    }

    removeExtra();

    document.addEventListener('beforeload', function(event) {
        removeExtra();
    }, true);

    window.addEventListener('beforescriptexecute', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(e.target).remove();
        removeExtra();
    }, true);

}

$(function() {

    if (!iscontrolpage) {

        removeExtra();

        for (var i = elemtntsToDeal.length - 1; i >= 0; i--) {
            var el = $(elemtntsToDeal[i]);
            if (el.length) {
                if (el.is('img')) {
                    open(el.attr('src'));
                    break;
                } else if (el.is('a')) {
                    open(el.attr('href'));
                    break;
                } else if (el.is('input')) {
                    el.click();
                    break;
                } else if (el.is('meta')) {
                    open(el.attr('content'));
                    break;
                }
            }
        }

    } else {
        $('textarea').val('');
        $('textarea').val(GM_getValue(sites, host));

        $('#clearsiteslog').click(function(event) {
            GM_setValue(sites, '');
            alert("Clead!");
        });

        $('#copysiteslog').click(function(event) {
            GM_setClipboard($("textarea").val(), 'text');
        });
    }

});

function open(url) {
    for (var i = replaces.items.length - 1; i >= 0; i--) {
        url = url.replace(replaces.items[i].find, replaces.items[i].replace);
    }
    window.location.assign(url);
}

function removeExtra() {
    $(elemtntsToRemove).each(function() {
        $(this).remove();
    });
}

function saveWebsiteToList() {
    var list = GM_getValue(sites, host);
    if (list.indexOf(host) != -1) {
        return;
    }
    list = list + '\n' + host;
    GM_setValue(sites, list);
}
