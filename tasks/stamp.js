/**
  * Copyright (C) 2014 yanni4night.com
  * stamp.js
  *
  * changelog
  * 2014-11-03[15:22:17]:authorized
  *
  * @author yanni4night@gmail.com
  * @version 0.2.4
  * @since 0.1.0
  */

'use strict';
var crypto = require('crypto');
var sysPath = require('path');
var fs = require('fs');
var Stamper = require('filestamp');
var extend = require('extend');
var urljoin = require('urljoin');

require('string.prototype.startswith');

//It's not useful when changeFileName is set to true
var sgDefaultStampName = 't';

module.exports = function(grunt) {

  var globalPattern = {
    'u': {
      pattern: /\burl\(\s*(['"])?(\s*\S+?\.(gif|bmp|jpe?g|ico|png|webp)\b(\?[^\)"']*)?\s*)\1?\s*\)/img,
      index: 2,
      whole: false
    },
    'l': {
      pattern: /<link.* href\s*=((['"])?(\s*\S+?\.css\b(\?[^\)"']*)?\s*)\2?)/img,
      index: 3,
      whole: false
    },
    's': {
      pattern: /<script.* src\s*=((['"])?(\s*\S+?\.js\b(\?[^\)"']*)?\s*)\2?)/img,
      index: 3,
      whole: false
    },
    'i': {
      pattern: /<img.* src\s*=((['"])?(\s*\S+?\.(gif|bmp|jpe?g|ico|png|webp)\b(\?[^\)"']*)?\s*)\2?)/img,
      index: 3,
      whole: false
    }
  };

  Object.freeze(globalPattern);

  grunt.registerMultiTask('stamp', 'Handle static resource timestamp in css&html', function() {

    var options = this.options({
      encoding: 'utf-8', //Just for read file
      prefix: '', //final path prefix
      baseDir: '.', //basic directory of target resources
      pattern: 'u|l|s|i', //url&link&script&img
      stampName: sgDefaultStampName, //p.png?{stampName}=876677,not useful when changFileName is set to true
      crypto: 'md5', //md5/sha1/sha256/sha512
      changeFileName: false, //main.css => main_be65d0.css
      regex: {},
      ignoreMissing: false,
      forceAbsolute: true,
      missingStamp: null, //Function
      fileStamp: null, //Function
      buildFileName: function(filename, ext, stamp) {
        return filename + '_' + stamp + "." + ext;
      }
    });

    if ('string' !== typeof options.stampName || !/^\w+$/.test(options.stampName)) {
      grunt.log.warn(options.stampName + ' is not a valid stamp name,"' + sgDefaultStampName + '" is used.');
      options.stampName = sgDefaultStampName;
    }

    var regexes = extend({}, globalPattern, options.regex || {});

    var stamper = new Stamper(options); //Stamper has to be singleton in one task
    var nameChangeCache = {}; //This is too.

    //Using options for future more parameters
    var Replacer = function(options) {
      this.options = options; //{patternName}
    };

    Replacer.prototype = {
      /**
       * Merge stamp into filename
       * @param  {[type]} path
       * @param  {[type]} stamp
       * @return {[type]}
       */
      changeFileName: function(path, stamp) {
        if (/(\w+)(\.(\w+))?$/.test(path)) {
          var s = RegExp.$1 + (RegExp.$2 || "");
          var d = options.buildFileName(RegExp.$1, RegExp.$3, stamp);
          return path.replace(s, d);
        } else {
          return path;
        }
      },
      replace: function(content) {

        var regex = regexes[this.options.patternName];
        var reg = regex.pattern;
        var index = regex.index;
        var whole = regex.whole;

        var matches, url, start, end;

        while (matches = reg.exec(content)) {
          url = matches[whole ? 0 : index];
          start = matches.index + matches[0].indexOf(url);
          end = start + url.length;
          content = content.slice(0, start) + this._stamp(matches[index]) + content.slice(end);
        }

        return content;
      },
      _stamp: function(url) {
        var content, md5, aliasName, fileName, prefix = options.prefix,
          isRelative = false;

        //Do trim
        url = String.prototype.trim.call(url);

        var parsedUrl = require('url').parse(url, true);

        //search is used instead of query when formatting
        delete parsedUrl.search;

        if (parsedUrl.protocol || /^(?:#|\/\/)/i.test(url)) {
          //we ignore illegal urls or urls with protocol
          //we see '//' as a dynamic protocol
          return url;
        }

        if (!parsedUrl.pathname.startsWith('/') && !options.forceAbsolute) {
          isRelative = true;
          fileName = sysPath.join(sysPath.dirname(this.options.filepath), parsedUrl.pathname);
        } else {
          fileName = sysPath.join(options.baseDir, parsedUrl.pathname);
        }

        md5 = 'function' === typeof options.fileStamp ? options.fileStamp(fileName) : stamper.compute(parsedUrl.pathname, isRelative ? sysPath.dirname(this.options.filepath) : null);

        if ('function' === typeof prefix) {
          prefix = prefix(parsedUrl.pathname);
        }

        if (!md5) {
          if (options.ignoreMissing) {
            md5 = 'function' === typeof options.missingStamp ? options.missingStamp(fileName) : Number(Date.now()).toString(36);
          } else {
            return urljoin(prefix, url);
          }
        }

        if (options.changeFileName) {
          if (!(aliasName = nameChangeCache[fileName]) && fs.existsSync(fileName)) {
            aliasName = this.changeFileName(url, md5);
            fs.renameSync(fileName, this.changeFileName(fileName, md5));
            nameChangeCache[fileName] = aliasName;
          }
          if (aliasName) {
            return urljoin(prefix, aliasName);
          }
        }

        if (!parsedUrl.query[options.stampName]) {
          //If we already has a stamp ,ignore 
          parsedUrl.query[options.stampName] = md5;
        }

        return urljoin(prefix, require('url').format(parsedUrl));

      }
    };

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
            var r = new Replacer({
              patternName: key,
              filepath: filepath
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