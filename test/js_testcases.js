/**
 * Copyright (C) 2014 yanni4night.com
 * js_testcases.js
 *
 * changelog
 * 2014-12-06[17:52:57]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

var PREFIX = '__img_cnd_prefix__';
var STAMP = '\\?t=\\d+';
var cases = {
    '"@/static/img/p.png@"': new RegExp('"' + PREFIX + '/static/img/p.png' + STAMP + '"'),
    //using relative path in javascript makes no sense!
    '"@../img/p.png@"': new RegExp('"../img/p.png' + STAMP + '"'),
    '"@../img/p.png?p=0@"': new RegExp('"../img/p.png\\?p=0&' + STAMP.slice(2) + '"')
};

exports.cases = cases;
exports.keys = Object.keys(cases).sort();