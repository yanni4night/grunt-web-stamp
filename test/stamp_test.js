'use strict';

var grunt = require('grunt');
var fc = require('filecompare');
var async = require('async');
var path = require('path');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.stamp = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  all: function(test) {
    test.expect(1);

    var files = ['index.html', 'static/css/test.css', 'static/js/mk.js'];

    var tasks = files.map(function(file) {
      return (function(f) {
        return function(cb) {
          var tmp = path.join(__dirname, 'tmp', f);
          var expected = path.join(__dirname, 'expected', f);
          fc(tmp, expected, function(equal) {
            if (equal) {
              grunt.log.debug(f + '(s) equal to each other');
            } else {
              cb(new Error(f + '(s) not equal to each other'));
            }
          });
        };
      })(file);
    });

    async.parallel(tasks, function(err) {
      test.ok(!!err, 'All file pairs should equal to each other');
      test.done();
    });
  }
};