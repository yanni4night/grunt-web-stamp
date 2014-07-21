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

module.exports = function(grunt) {

  var globalPattern = {
    'u': /url\(\s*(([\'"])?([\S]+?\.(gif|bmp|jpe?g|ico|png))\2?)\s*\)/img,
    'l': /<link.* href=(([\'"])?(.*?\.css)\2?)/img,
    's': /<script.* src=(([\'"])?(.*?\.js)\2?)/img,
    'i': /<img.* src=(([\'"])(.*?\.(png|gif|jpe?g|bmp|ico))\2)/img
  };

  Object.freeze(globalPattern);

  grunt.registerMultiTask('stamp', 'Handle static resource timestamp in css&html', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      encoding: 'utf-8',
      prefix: '', //final path prefix
      baseDir: '.', //basic directory of target resources
      pattern: 'ulsi', //url&link&script&img
      stampName: 't', //p.png?{stampName}=876677
      crypto: 'md5',//md5/sha1/sha256/sha512
      changeFileName: false//main.css => main_be65d0.css
    });

    //var stampCache = {};
    var nameChangeCache = {};

    if (!/^[\w\-]$/.test(options.stampName)) {
      grunt.log.warn(options.stampName + ' is not a valid stamp name.');
      options.stampName = 't';
    }

    if (!~['md5', 'sha1', 'sha256', 'sha512'].indexOf(options.crypto)) {
      grunt.log.warn(options.crypto + ' is not a valid crypto algorithm.');
      options.crypto = 'md5';
    }

    var stamper = new Stamper(options);

    /**
     * Merge stamp into filename
     * @param  {[type]} path  [description]
     * @param  {[type]} stamp [description]
     * @return {[type]}       [description]
     */
    function changeFileName(path, stamp) {
      if (/(\w+)\.(\w+)$/.test(path)) {
        var s = RegExp.$1 + "." + RegExp.$2;
        var d = RegExp.$1 + '_' + stamp + "." + RegExp.$2;
        return path.replace(s, d);
      } else {
        return path;
      }
    }

    function doReplace(n) {
      var key = String(RegExp.$3).trim();
      var baseDir = options.baseDir;
      var path, content, md5;

      //invalid path or absolute path
      if (/^(#|http|\/\/|data:|about:)|\s/.test(key)) {
        return n;
      }

      if ('function' === typeof baseDir) {
        baseDir = baseDir(n);
      }

      path = sysPath.join(baseDir, key);
/*
      if (!(md5 = stampCache[path])) {
        if (!grunt.file.exists(path)) {
          grunt.log.warn("Target file " + path + " not found.");
          return n;
        }
        content = grunt.file.read(path);
        md5 = crypto.createHash(options.crypto).update(content).digest('hex');
        md5 = (parseInt(md5, 16) % 1e+6) | 0;
        stampCache[path] = md5;
      }*/

      md5 = stamper.compute(key)

      if (options.changeFileName) {
        var aliasName;
        if (!(aliasName = nameChangeCache[path])) {
          aliasName = changeFileName(key, md5);
          fs.renameSync(path, changeFileName(path, md5));
          nameChangeCache[path] = aliasName;
        }
        return n.replace(key, options.prefix + aliasName);
      }

      return n.replace(key, options.prefix + key + '?' + options.stampName + '=' + md5);
    }

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

        for (var key in globalPattern) {
          if ('function' === typeof options.pattern) {
            pattern = options.pattern(filepath);
          } else {
            pattern = String(options.pattern);
          }

          if (!!~pattern.indexOf(key)) {
            content = content.replace(globalPattern[key], doReplace);
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