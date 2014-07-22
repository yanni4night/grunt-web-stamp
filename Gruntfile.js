/*
 * grunt-stamp
 * https://github.com/yanni4night/grunt-stamp
 *
 * Copyright (c) 2014 yinyong
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
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
        cwd: 'test/fixtures',
        src: ['img/*.png'],
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
          prefix: 'http://p0.css.cdn.com/',
          pattern: "s|l|i",
          baseDir: 'test/fixtures'
        },
        files: {
          'tmp/index.html': 'test/fixtures/index.html'
        }
      },
      css: {
        options: {
          pattern: function() {
            return 'u|@';
          },
          stampName: '_',
          crypto: 'sha256',
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
        files: {
          "tmp/test.css": "test/fixtures/test.css"
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('default', ['jshint', 'clean', 'copy', 'stamp']);

  // By default, lint and run all tests.
  grunt.registerTask('test', ['default', 'nodeunit']);

};