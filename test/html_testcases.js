/**
 * Copyright (C) 2014 yanni4night.com
 * html_testcases.js
 *
 * changelog
 * 2014-12-06[17:24:57]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
var PREFIX = '__(?:j|cs)s_cnd_prefix__';
var STAMP = '\\?t=\\d+';
var cases = {
    /* normal relative link path */
    '<link href ="static/css/tmp.css" rel="stylesheet"/>': new RegExp('static/css/tmp.css' + STAMP),
    /* normal relative link path with singel quotation marks*/
    '<link href =\'static/css/tmp.css\' rel="stylesheet"/>': new RegExp('static/css/tmp.css' + STAMP),
    /* normal absolute path */
    '<link href ="/static/css/tmp.css" rel="stylesheet"/>': new RegExp(PREFIX + '/static/css/tmp.css' + STAMP),
    /* missing path */
    '<link href ="missing{key}.css" rel="stylesheet"/>': true,
    /* path with spaces inside */
    '<link href="  static/css/tmp.css?p=0  " rel="stylesheet"/>': new RegExp('static/css/tmp.css\\?p=0&' + STAMP.slice(2)),
    /* normal relative script path */
    '<script src="static/js/mk.js" type="text/javascript"></script>': new RegExp('static/js/mk.js' + STAMP),
    /* path with leading doubel / */
    '<script src=" //mk.js" type="text/javascript"></script>': /"\/\/mk.js"/,
    /* path is about:blank */
    '<script src=" about:blank " type="text/javascript"></script>': true,
    /* path is # */
    '<script src="#" type="text/javascript"></script>': true,
    /* path with stamp */
    '<script src="static/js/mk.js?t=90" type="text/javascript"></script>': true,
    /* path in url */
    'url(static/img/c.png)': new RegExp('url\\(static/img/c.png' + STAMP + '\\)'),
    /* path in img element */
    '<img src="static/img/c.png"/>': new RegExp('"static/img/c.png' + STAMP + '"'),
    /* img which is missing */
    '<img src="static/img/p.png"/>': true
};
exports.cases = cases;
exports.keys = Object.keys(cases).sort();