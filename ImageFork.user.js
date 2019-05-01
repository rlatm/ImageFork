// ==UserScript==
// @name        ImageFork
// @description Just browsing images!
// @namespace   https://github.com/plsankar1996/ImageFork
// @homepage    https://github.com/plsankar1996/ImageFork
// @author      plsankar1996
// @version     2.7
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
// @include     *://main.imgclick.net/*
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
// @include     *://trans.firm.in/*
// @include     *://imguur.pictures/*
// @include     *://imgsee.net/*
// @include     *://imgfile.net/*
// @include     *://*.imgfile.net/*
// @include     *://imgmak.com/image/*
// @include     *://extraimages.net/image/*
// @include     */img-*.html
// @include     */imgs-*.html
// @include     */imgv-*.html
// @include     */share-*.html
// @include     */upload/big/20*
// @include     */site/v/*
// ==/UserScript==

const href = window.location.href;
const host = window.location.hostname;
var $ = window.jQuery;
const iscontrolpage = host == 'plsankar1996.github.io';
const mutationObserver_Config = {
    childList: true,
    subtree: true
};

const observer = new MutationObserver(onDOMChange);

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
        replace: "i.imgur.com/",
        append: ".jpg",
        prepend: "http://href.li/?"
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
    '#imagefork',
    'input[type=submit]',
    'meta[property*="og:image"]:not(meta[content*="logo"])',
    'img[src*="' + host + '/uploads/big/"]',
    'img[src*="' + host + '/upload/big/"]',
    'img[src*="' + host + '/uploads/small/"]',
    'img[src*="' + host + '/upload/small/"]',
    'img[src*="' + host + '/img/"]',
    'img[src*="' + host + '/images/"]',
    'img[src*="' + host + '/wp-content/uploads/"]',
    'img#iimg',
    '#full_image',
    'img#myImg',
    '.centred',
    '.centred_resized',
    '#show_image',
    '.code_image',
    '#thepic',
    'a:has(img#myUniqueImg)',
    ".pic",
    'input[type=submit][value*="continue"]',
    'input[type=submit][value*="Continue"]',
    'form input[type=submit][value*="continue"]',
    'form input[type=submit][value*="Continue"]'
];

var elemtntsToRemove =
    'script:not(script:contains("soDaBug")), noscript, iframe, frame, link, style, ' +
    '#popup, .ads, #ads, div[class*="ads"], div[class*="ad"], ' +
    'header, #header, .header, img[src*="logo"], .brand, .menu, #menu, .logo, #logo, .navbar, .sidenav, nav, .nav, #nav, ' +
    'ul, li, textarea, ' +
    'footer, #footer, .footer, #foot';

if (href.lastIndexOf(host) + host.length - href.length == -1) {
    return false;
}

if (document.images.length == 1 && document.images[0].src == window.location.href) {
    if (autoResize) {
        document.images[0].width = document.images[0].naturalWidth;
        document.images[0].height = document.images[0].naturalHeight;
    }
    return false;
}

if (!iscontrolpage) {

    document.title += " - ImageFork";

    saveWebsiteToList();

    for (var i = redirects.items.length - 1; i >= 0; i--) {
        if (href.indexOf(redirects.items[i].find) > -1) {
            window.stop();
            var newhref = href.replace(redirects.items[i].find, redirects.items[i].replace);
            if (redirects.items[i].hasOwnProperty("append")) {
                newhref = newhref + redirects.items[i].append;
            }
            if (redirects.items[i].hasOwnProperty("prepend")) {
                newhref = redirects.items[i].prepend + newhref;
            }
            window.location.assign(newhref);
            return;
        }
    }

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
        if (el.length) {
            console.log('Element exists!');
            observer.disconnect();
            window.stop();
            if (el.is('img')) {
                open(el.attr('src'));
            } else if (el.is('a')) {
                open(el.attr('href'));
            } else if (el.is('input')) {
                el.click();
            } else if (el.is('meta')) {
                open(el.attr('content'));
            }
            return;
        }
    }

    pixsense_img();
}


function cleanDOM() {
    $(elemtntsToRemove).remove();
}

function pixsense_img() {
    var img = $('img#imagefork');
    if (img.length === 0) {
        var script = $('script:contains("soDaBug")');
        if (script.length) {
            var content = script.text();
            var src = content.slice(content.lastIndexOf('").src = "'), content.indexOf('";'));
            src = src.replace('").src = "', '');
            $('body').append('<img id="imagefork" src="' + src + '"></img>');
        }
    }
}
