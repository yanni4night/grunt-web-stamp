/*
 * grunt-web-stamp
 * https://github.com/yanni4night/grunt-web-stamp
 *
 * Copyright (c) 2014 yinyong
 * Licensed under the MIT license.
 */

'use strict';
var crypto = require('crypto');
var sysPath = require('path');
var fs = require('fs');
var Stamper = require('filestamp');
var extend = require('extend');

//It's not useful when changeFileName is set to true
var sgDefaultStampName = 't';

module.exports = function(grunt) {

  var globalPattern = {
    'u': {
      pattern: /url\(\s*(([\'"])?([\S]+?\.(gif|bmp|jpe?g|ico|png))\2?)\s*\)/img,
      index: 3
    },
    'l': {
      pattern: /<link.* href=(([\'"])?(.*?\.css)\2?)/img,
      index: 3
    },
    's': {
      pattern: /<script.* src=(([\'"])?(.*?\.js)\2?)/img,
      index: 3
    },
    'i': {
      pattern: /<img.* src=(([\'"])(.*?\.(png|gif|jpe?g|bmp|ico))\2)/img,
      index: 3
    }
  };

  Object.freeze(globalPattern);

  function Replacer(options) {
    //options{pattern,index,baseDir,prefix,changeFileName,stampName}
    this.options = options;
  }

  Replacer.prototype = {
    /**
     * Merge stamp into filename
     * @param  {[type]} path  [description]
     * @param  {[type]} stamp [description]
     * @return {[type]}       [description]
     */
    changeFileName: function(path, stamp) {
      if (/(\w+)\.(\w+)$/.test(path)) {
        var s = RegExp.$1 + "." + RegExp.$2;
        var d = RegExp.$1 + '_' + stamp + "." + RegExp.$2;
        return path.replace(s, d);
      } else {
        return path;
      }
    },
    replace: function(content) {

      var reg = this.options.pattern;
      var index = this.options.index;

      var matches, url, start, end;
      while (matches = reg.exec(content)) {
        url = matches[index];
        start = matches.index + matches[0].indexOf(url);
        end = start + url.length;
        content = content.slice(0, start) + this._stamp(url) + content.slice(end);
      }
      return content;
    },
    _stamp: function(url) {
      var path, content, md5, aliasName;

      //invalid path or absolute path
      if (/^(#|\/\/|[a-z]+:)|\s/i.test(url)) {
        return url;
      }

      path = sysPath.join(this.options.baseDir, url);

      md5 = this.options.stamper.compute(url);

      if (this.options.changeFileName) {
        if (!(aliasName = this.options.nameChangeCache[path])) {
          aliasName = this.changeFileName(url, md5);
          fs.renameSync(path, this.changeFileName(path, md5));
          this.options.nameChangeCache[path] = aliasName;
        }
        return this.options.prefix + aliasName;
      }

      return this.options.prefix + url + '?' + this.options.stampName + '=' + md5;

    }
  };

  grunt.registerMultiTask('stamp', 'Handle static resource timestamp in css&html', function() {

    var options = this.options({
      encoding: 'utf-8',
      prefix: '', //final path prefix
      baseDir: '.', //basic directory of target resources
      pattern: 'ulsi', //url&link&script&img
      stampName: sgDefaultStampName, //p.png?{stampName}=876677
      crypto: 'md5', //md5/sha1/sha256/sha512
      changeFileName: false, //main.css => main_be65d0.css
      regex: {}
    });

    if (!/^[\w\-]$/.test(options.stampName)) {
      grunt.log.warn(options.stampName + ' is not a valid stamp name,"' + sgDefaultStampName + '" is used.');
      options.stampName = sgDefaultStampName;
    }

    var regexes = extend({}, globalPattern, options.regex);

    var stamper = new Stamper(options);
    var nameChangeCache = {};

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        var content = grunt.file.read(filepath);
        var pattern;

        for (var key in regexes) {
          if ('function' === typeof options.pattern) {
            pattern = String(options.pattern(filepath));
          } else {
            pattern = String(options.pattern);
          }

          if (~pattern.split('|').indexOf(key)) {
            //What a crap!
            var r = new Replacer({
              pattern: regexes[key].pattern,
              index: regexes[key].index,
              baseDir: options.baseDir,
              prefix: options.prefix,
              changeFileName: options.changeFileName,
              stampName: options.stampName,
              stamper: stamper,
              nameChangeCache: nameChangeCache
            });
            content = r.replace(content);
          }
        }

        return content;
      }).join('');

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" stamped.');
    });
  });

};