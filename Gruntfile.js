/*
 * grunt-stamp
 * https://github.com/yanni4night/grunt-stamp
 *
 * Copyright (c) 2014 yinyong
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        strict: true,
        node: true,
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp', "**/._*"],
    },
    copy: {
      static: {
        expand: true,
        cwd: 'test/source',
        src: ['**/*.{png,css,js,html}'],
        dest: 'tmp'
      }
    },
    // Configuration to be run (and then tested).
    stamp: {
      options: {
        baseDir: 'tmp',
        prefix: 'http://p0.img.cdn.com/'
      },
      html: {
        options: {
          prefix: function(file) {
            return /\.css$/.test(file) ? 'http://p0.css.cdn.com/' : 'http://p0.js.cdn.com/';
          },
          pattern: "s|l|i",
          baseDir: 'test/fixtures',
          ignoreMissing: true,
          missingStamp: function(path) {
            return Date.now();
          },
          fileStamp: function(path) {
            return 0x11929;
          }
        },
        expand: true,
        cwd: 'tmp',
        src: ['**/*.html'],
        dest: 'tmp'
      },
      css: {
        options: {
          forceAbsolute: false,
          pattern: function() {
            return 'u|@';
          },
          stampName: '_',
          crypto: 'sha256',
          ignoreMissing: true,
          changeFileName: true,
          regex: {
            '@': {
              pattern: /@([\/\w-\.]+)@/mg,
              index: 1,
              whole: true
            }
          },
          buildFileName: function(name, ext, stamp) {
            return name + '-' + stamp + "." + ext;
          }
        },
        expand: true,
        cwd: 'tmp',
        src: ['**/*.css'],
        dest: 'tmp'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },
    markdown: {
      options: {
        template: 'markdown.tpl'
      },
      all: {
        files: [{
          expand: true,
          src: '*.md',
          dest: '.',
          ext: '.html'
        }]
      }
    },
    coveralls: {
      all: {
        src: './coverage/lcov.info'
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('default', ['jshint', 'clean', 'copy', 'stamp', 'markdown']);

  // By default, lint and run all tests.
  grunt.registerTask('test', ['default', 'nodeunit']);

};