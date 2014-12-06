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
    src: 'fixtures',
    dest: 'tmp',
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
      tests: ['test/<%= dest %>'],
    },
    copy: {
      all: {
        expand: true,
        cwd: 'test/<%= src %>',
        src: ['**/*.{gif,jpg,png,css,js,html}'],
        dest: 'test/<%= dest %>'
      }
    },
    // Configuration to be run (and then tested).
    stamp: {
      options: {
        prefix: '__cnd_prefix__',
        baseDir: 'test/<%= dest %>'
      },
      js: {
        options: {
          pattern: function() {
            return '@';
          },
          regex: {
            '@': {
              pattern: /@([\/\w-\.]+)@/mg,
              index: 1,
              whole: true
            }
          }
        },
        expand: true,
        cwd: 'test/<%= dest %>',
        src: ['**/*.js'],
        dest: 'test/<%= dest %>'
      },
      css: {
        options: {
          algorithm: 'sha256',
          changeFileName: true,
          buildFileName: function(name, ext, stamp) {
            return name + '-' + stamp + "." + ext;
          }
        },
        expand: true,
        cwd: 'test/<%= dest %>',
        src: ['**/*.css'],
        dest: 'test/<%= dest %>'
      },
      html: {
        options: {
          prefix: function(file) {
            return /\.css$/.test(file) ? 'http://p0.css.cdn.com/' : 'http://p0.js.cdn.com/';
          },
          // pattern: "s|l|i",
          baseDir: 'test/absence',
          ignoreError: true,
          missingStamp: function( /*path*/ ) {
            return '20141205';
          }
        },
        expand: true,
        cwd: 'test/<%= dest %>',
        src: ['**/*.html'],
        dest: 'test/<%= dest %>'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },
    coveralls: {
      all: {
        src: './coverage/lcov.info'
      }
    }
  });

  grunt.registerTask('cases', 'create test cases', function() {
    var cssCases = require('./test/css_testcases');
    grunt.file.write('test/fixtures/static/css/tmp.css', cssCases.keys.join('\n'));
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('default', ['jshint', 'clean', 'copy', 'stamp']);

  // By default, lint and run all tests.
  grunt.registerTask('test', ['cases', 'default', 'nodeunit']);

};