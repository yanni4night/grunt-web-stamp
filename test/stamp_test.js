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
  css: function(test) {
    var cssCases = require('./css_testcases');
    var srclines = grunt.file.read('test/fixtures/static/css/tmp.css').split('\n');
    var tmplines = grunt.file.read('test/tmp/static/css/tmp.css').split('\n');

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
    var tmplines = grunt.file.read('test/tmp/tmp.html').split('\n');

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
  js: function(test) {
    var jsCases = require('./js_testcases');
    var srclines = grunt.file.read('test/fixtures/static/js/tmp.js').split('\n');
    var tmplines = grunt.file.read('test/tmp/static/js/tmp.js').split('\n');

    test.expect(tmplines.length * 2 + 1);

    test.equal(srclines.length, tmplines.length, 'Number of lines of src and tmp files should equal');

    tmplines.forEach(function(line, idx) {
      var key = srclines[idx],
        reg = jsCases.cases[key];
      test.ok(!!reg, 'Pattern for ' + key + ' should exist');
      test.ok(util.isRegExp(reg) ? reg.test(line) : ('string' === typeof reg ? reg === line : key === line), line + ' should match ' + reg);
    });

    test.done();
  }
};