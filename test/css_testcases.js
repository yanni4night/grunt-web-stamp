/**
 * Copyright (C) 2014 yanni4night.com
 * css_testcases.js
 *
 * changelog
 * 2014-12-06[16:31:22]:revised
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
var PREFIX = '__img_cnd_prefix__';
var STAMP = '\\-\\d+';
var cases = {
    /*normal absolute path*/
    'url(/static/img/p.png)': new RegExp('url\\(' + PREFIX + '\\/static\\/img\\/p' + STAMP + '.png' + '\\)'),
    /*normal absolute path with missing file on the disk*/
    'url(/static/img/missing.png)': 'url(' + PREFIX + '/static/img/missing.png' + ')',
    /*absolute path with template tags,this can be seem as another missing file*/
    'url(/static/img/{{tpl}}.png)': 'url(' + PREFIX + '/static/img/{{tpl}}.png' + ')',
    /*normal relative path*/
    'url(../img/p.png)': new RegExp('url\\(../img/p' + STAMP + '.png\\)'),
    /*normal relative path with timestamp*/
    'url(../img/p.png?t=88)': new RegExp('url\\(../img/p' + STAMP + '.png\\?t=88\\)'),
    /*normal relative path with missing file*/
    'url(../img/missing.png)': true,
    /*normal relative path with missing file and timestamp*/
    'url(../img/missing.png?t=89)': true,
    /*relative path with template tags,this can be seem as another missing file*/
    'url(../img/{{tpl}}.png)': true,
    /*absolute path wrapped by quotation marks*/
    'url("/static/img/p.png")': new RegExp('url\\("' + PREFIX + '/static/img/p' + STAMP + '.png"\\)'),
    /*absolute path wrapped by single quotation marks*/
    'url(\'/static/img/p.png\')': new RegExp('url\\(\'' + PREFIX + '/static/img/p' + STAMP + '.png\'\\)'),
    /*relative path wrapped by quotation marks*/
    'url("b.jpg")': new RegExp('url\\("b' + STAMP + '.jpg"\\)'),
    /*path with leading double /*/
    'url(//static/img/p.png)': true,
    /*path with leading #*/
    'url(#static/img/p.png)': true,
    /*absolute path with stamp*/
    'url(/static/img/p.png?t=90)': new RegExp('url\\(' + PREFIX + '/static/img/p' + STAMP + '.png\\?t=90\\)'),
    /*absolute path with spaces outside*/
    'url( "/static/img/p.png"  )': new RegExp('url\\( "' + PREFIX + '/static/img/p' + STAMP + '.png"  \\)'),
    /*absolute path with spaces inside*/
    'url( \' /static/img/p.png \')': new RegExp('url\\( \'' + PREFIX + '/static/img/p' + STAMP + '.png\'\\)'),
    /*path is about:blank*/
    'url(about:blank)': true,
    /*path with protocol*/
    'url(http://xxx...)': true,
    /*path is #*/
    'url(#)': true,
    /*path starts with data:*/
    'url(data:image...)': true,
    /*spaces path*/
    'url(   )': true,
    /*absence path*/
    'url(mn)': true
};

exports.cases = cases;
exports.keys = Object.keys(cases).sort();