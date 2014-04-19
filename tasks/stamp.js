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
      prefix: '', //final path prefix
      baseDir: '.', //basic directory of target resources
      pattern: 'ulsi', //url&link&script&img
      stampName: 't' //p.png?{stampName}=876677
    });

    if (!/^[\w\-]$/.test(options.stampName)) {
      grunt.log.warn(options.stampName + ' is not a valid stamp name.');
      options.stampName = 't';
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

      if (!grunt.file.exists(path)) {
        grunt.log.warn("Target file " + path + " not found.");
        return n;
      }

      content = grunt.file.read(path);
      md5 = crypto.createHash('md5').update(content).digest('hex');
      md5 = (parseInt(md5, 16) % 1e+6) | 0;
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

          if ( !! ~pattern.indexOf(key)) {
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