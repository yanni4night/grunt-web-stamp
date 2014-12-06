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
        cwd: 'test',
        src: ['{<%= src %>,copysrc}/**/*.{gif,jpg,png,css,js,html}'],
        dest: 'test/<%= dest %>'
      }
    },
    // Configuration to be run (and then tested).
    stamp: {
      options: {
        prefix: '__img_cnd_prefix__',
        baseDir: 'test/<%= dest %>/<%= src %>'
      },
      js: {
        options: {
          pattern: function() {
            return '@';
          },
          regex: {
            '@': {
              pattern: /@([\/\w-\.\?=]+)@/mg,
              index: 1,
              whole: true
            }
          }
        },
        expand: true,
        cwd: 'test/<%= dest %>',
        src: ['**/tmp.js'],
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
        src: ['**/tmp.css'],
        dest: 'test/<%= dest %>'
      },
      html: {
        options: {
          prefix: function(file) {
            return /\.css$/.test(file) ? '__css_cnd_prefix__' : '__js_cnd_prefix__';
          },
          ignoreError: true
        },
        expand: true,
        cwd: 'test/<%= dest %>',
        src: ['**/tmp.html'],
        dest: 'test/<%= dest %>'
      },
      copy: {
        options: {
          changeFileName: true,
          doCopy: true
        },
        expand: true,
        cwd: 'test/tmp/copysrc',
        src: ['index.html'],
        dest: 'test/tmp/copysrc'
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
    grunt.file.write('test/fixtures/static/css/tmp.css', require('./test/css_testcases').keys.join('\n'));
    grunt.file.write('test/fixtures/static/js/tmp.js', require('./test/js_testcases').keys.join('\n'));
    grunt.file.write('test/fixtures/tmp.html', require('./test/html_testcases').keys.join('\n'));
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('default', ['jshint', 'clean', 'cases', 'copy', 'stamp']);

  // By default, lint and run all tests.
  grunt.registerTask('test', ['default', 'nodeunit']);

};