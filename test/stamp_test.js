'use strict';

var grunt = require('grunt');
var util = require('util');

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
  js: function(test) {
    var jsCases = require('./js_testcases');
    var srclines = grunt.file.read('test/fixtures/static/js/tmp.js').split('\n');
    var tmplines = grunt.file.read('test/tmp/fixtures/static/js/tmp.js').split('\n');

    test.expect(tmplines.length * 2 + 1);

    test.equal(srclines.length, tmplines.length, 'Number of lines of src and tmp files should equal');

    tmplines.forEach(function(line, idx) {
      var key = srclines[idx],
        reg = jsCases.cases[key];
      test.ok(!!reg, 'Pattern for ' + key + ' should exist');
      test.ok(util.isRegExp(reg) ? reg.test(line) : ('string' === typeof reg ? reg === line : key === line), line + ' should match ' + reg);
    });

    test.done();
  },
  css: function(test) {
    var cssCases = require('./css_testcases');
    var srclines = grunt.file.read('test/fixtures/static/css/tmp.css').split('\n');
    var tmplines = grunt.file.read('test/tmp/fixtures/static/css/tmp.css').split('\n');

    test.expect(tmplines.length * 2 + 1);

    test.equal(srclines.length, tmplines.length, 'Number of lines of src and tmp files should equal');

    tmplines.forEach(function(line, idx) {
      var key = srclines[idx],
        reg = cssCases.cases[key];
      test.ok(!!reg, 'Pattern for ' + key + ' should exist');
      test.ok(util.isRegExp(reg) ? reg.test(line) : ('string' === typeof reg ? reg === line : key === line), line + ' should match ' + reg);
    });

    test.done();
  },
  html: function(test) {
    var htmlCases = require('./html_testcases');
    var srclines = grunt.file.read('test/fixtures/tmp.html').split('\n');
    var tmplines = grunt.file.read('test/tmp/fixtures/tmp.html').split('\n');

    test.expect(tmplines.length * 2 + 1);

    test.equal(srclines.length, tmplines.length, 'Number of lines of src and tmp files should equal');

    tmplines.forEach(function(line, idx) {
      var key = srclines[idx],
        reg = htmlCases.cases[key];
      test.ok(!!reg, 'Pattern for ' + key + ' should exist');
      test.ok(util.isRegExp(reg) ? reg.test(line) : ('string' === typeof reg ? reg === line : key === line), line + ' should match ' + reg);
    });

    test.done();
  },
  copy: function(test) {
    var content = grunt.file.read('test/tmp/copysrc/index.html');
    var matches = content.match(/bulk_\d+.css/);
    test.ok(!!(matches || [])[0], 'filename in html should renamed');
    test.ok(grunt.file.exists('test/tmp/copysrc/' + matches[0]), 'bulk.css should be copied');
    test.ok(grunt.file.exists('test/tmp/copysrc/bulk.css'), 'bulk.css should be reserved');
    matches = content.match(/mock_\d+.js/);
    test.ok(!!(matches || [])[0], 'filename in html should renamed');
    test.ok(grunt.file.exists('test/tmp/copysrc/' + matches[0]), 'mock.js should be copied');
    test.ok(grunt.file.exists('test/tmp/copysrc/mock.js'), 'mock.js should be reserved');
    test.done();
  }
};