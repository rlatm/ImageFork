// ==UserScript==
// @name        ImageFork
// @description This script makes browsing images hosting sites easier
// @namespace   https://github.com/plsankar1996/ImageFork
// @homepage    https://github.com/plsankar1996/ImageFork
// @author      plsankar1996
// @version     2.0
// @downloadURL https://github.com/plsankar1996/ImageFork/raw/master/ImageFork.user.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at      document-start
// @include     *://plsankar1996.github.io/ImageFork/config.html
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
// @include     *://*.imgspice.com/*
// @include     *://www.imagebam.com/*
// @include     *://bustyimg.top/image/*
// @include     */img-*.html
// @include     */imgs-*.html
// @include     */imgv-*.html
// @include     */upload/big/20*
// @include     */site/v/*
// @include     *://trans.firm.in/*
// ==/UserScript==

const href = window.location.href;
const host = window.location.hostname;
var $ = window.jQuery;
const iscontrolpage = host == 'plsankar1996.github.io';
const mutationObserver_Config = {
    childList: true,
    subtree: true
};

const key_siteLog = 'key_siteLog';
const key_autoResize = "key_autoResize";
var autoResize = GM_getValue(key_autoResize, false);

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
    'input[type=submit]',
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

var elemtntsToRemove = 'script, noscript, link, style, header, #header, .header, .menu, #menu, .logo, #logo, ul, li, .login_cuerpo, footer, #footer, .footer, iframe, frame, #popup, .ads,#ads, .navbar, .sidenav, textarea, #foot';

//Main Page
if (href.lastIndexOf(host) + host.length - href.length == -1) {
    return false;
}

//ImageOnly
if (document.images.length == 1 && document.images[0].src == window.location.href) {
    if (autoResize) {
        document.images[0].width = document.images[0].naturalWidth;
        document.images[0].height = document.images[0].naturalHeight;
    }
    return false;
}

if (!iscontrolpage) {

    document.title = "ImageFork Working...";

    saveWebsiteToList();

    for (var i = redirects.items.length - 1; i >= 0; i--) {
        if (href.indexOf(redirects.items[i].find) > -1) {
            window.location.assign(href.replace(redirects.items[i].find, redirects.items[i].replace));
            break;
        }
    }

    const observer = new MutationObserver(onDOMChange);

    observer.observe(document, mutationObserver_Config);

    GM_registerMenuCommand("Config ImageFork", openConfig, "c");

    document.addEventListener('beforeload', function(event) {
        cleanDOM();
    }, true);

    window.addEventListener('beforescriptexecute', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(e.target).remove();
        cleanDOM();
    }, true);

}

if (iscontrolpage) {

    $(function() {

        $('#install-alert').toggleClass('d-none');
        $('#config-content').toggleClass('d-none');

        var log = GM_getValue(key_siteLog, '\n');
        $('textarea').val(log.slice(1, log.length));

        $('#autoresize').attr("checked", GM_getValue(key_autoResize, false));

        $('#clearsiteslog').click(function(event) {
            $('textarea').val('');
            GM_setValue(key_siteLog, '');
            alert("Cleared!");
        });

        $('#copysiteslog').click(function(event) {
            GM_setClipboard($("textarea").val(), 'text');
        });

        $('#autoresize').change(function(event) {
            GM_setValue(key_autoResize, $(this).is(':checked'));
        });

    });

}

function open(url) {
    for (var i = replaces.items.length - 1; i >= 0; i--) {
        url = url.replace(replaces.items[i].find, replaces.items[i].replace);
    }
    window.location.assign(url);
}

function saveWebsiteToList() {
    var list = GM_getValue(key_siteLog, '');
    if (list.indexOf(host) != -1) {
        return;
    }
    list = list + '\n' + host;
    GM_setValue(key_siteLog, list);
}


function openConfig() {
    window.open("https://plsankar1996.github.io/ImageFork/config.html");
}

function onDOMChange(mutations) {

    cleanDOM();

    for (var i = elemtntsToDeal.length - 1; i >= 0; i--) {
        var el = $(elemtntsToDeal[i]);
        console.log('Checking for DOM ' + elemtntsToDeal[i]);
        console.log('Checking for DOM Exists : ' + el.length);
        if (el.length) {
            console.log('Element exists!');
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
}


function cleanDOM() {
    $(elemtntsToRemove).remove();
}
