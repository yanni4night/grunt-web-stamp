/*
 * grunt-stamp
 * https://github.com/yanni4night/grunt-stamp
 *
 * Copyright (c) 2014 yinyong
 * Licensed under the MIT license.
 */

'use strict';
var crypto = require('crypto');
var sysPath = require('path');
module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

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
      prefix: '',
      baseDir: '.',
      pattern: 'ulsi' //url&link&script&img
    });

    function _do(n, z) {
      var key = String(z).trim();
      if (/^(#|http|\/\/|data:|about:)|\s/.test(key)) {
        return n;
      }

      var path = sysPath.join(options.baseDir, key);
      if (!grunt.file.exists(path)) {
        grunt.log.warn("File " + path + " do not exists!");
        return n;
      }

      var content = grunt.file.read(path);
      var md5 = crypto.createHash('md5').update(content).digest('hex');
      md5 = (parseInt(md5, 16) % 1e+6) | 0;
      return n.replace(key, options.prefix + key + '?t=' + md5);
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
        var _re = function(n) {
          return _do(n, RegExp.$3);
        };
        for (var key in globalPattern) {
          var pat;
          if ('function' === typeof options.pattern) {
            pat = options.pattern(filepath);
          } else {
            pat = String(options.pattern);
          }
          if ( !! ~pat.indexOf(key)) {
            content = content.replace(globalPattern[key], _re);
          }
        }

        return content;
      }).join('');

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};