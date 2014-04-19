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

    // Configuration to be run (and then tested).
    stamp: {
      options: {
        baseDir: 'test/fixtures',
        prefix: 'http://p0.img.sogoucdn.com/'
      },
      html: {
        options: {
          prefix: 'http://p0.css.sogoucdn.com/',
          pattern: "sli",
          baseDir:function(filename){
            return 'test/fixtures';
          }
        },
        files: {
          'tmp/index.html': 'test/fixtures/index.html'
        }
      },
      css: {
        options: {
          pattern: function() {
            return 'u';
          },
          stampName:'_',
          crypto:'sha256'
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
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'stamp', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};