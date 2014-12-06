# grunt-web-stamp

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Build status][appveyor-image]][appveyor-url] [![Dependency status][david-dm-image]][david-dm-url] [![De vDependency status][david-dm-dev-image]][david-dm-dev-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Built with Grunt][grunt-image]][grunt-url]

We now support more custom characteristics.

> Add timestamp to the url path.It search `<img/>`,`<link/>`,`<script/>` and `url()` to resolve
> every path and calculate timestamp to append to it.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-web-stamp --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-web-stamp');
```

## The "stamp" task

### Overview
In your project's Gruntfile, add a section named `stamp` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  stamp: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### baseDir
Type: `String`
Default value: `'.'`

A string value that is indicating where the resource files are.

You can assign a function instead:

    {
        baseDir:function(targetFilePath){return "static/";}
    }

#### prefix
Type: `String` or `Function`
Default value: `''`

A string value that will be prepended to each url path.If it's defined as a function,real filepath will be passed in as the only parameter.Ex:

    prefix:function(filepath){return /\.css$/.test(filepath)?'cdn_css':'cdn_js';}

#### pattern
Type: `String` or `Function`
Default value: `'u|l|s|i'`

A char sequence indicates which kinds of url should be handled.

 - 'i':`<img/>`
 - 'l':`<link/>`
 - 'u':`url()`
 - 's':`<script/>`

You can make any combination of them,they're case-sensitive.

You can assign a function instead.

    {
        "pattern":function(filepath){
          return /\.html$/.test(filepath)?"l|i|s":"u";
        }
    }

#### stampName
Type: `String`
Default value: `'t'`

Query name for the timestamp.

#### algorithm
Type: `String`
Default value: `'md5'`

A crypto algorithm name.More available names are `sha1`,`sha256` and `sha512`.

####cryto
Alias for algorithm,_deprecated_.

#### changeFileName
Type: `Boolean`
Default value: `false`

If set to true,stamp will be merged into filname instead of appended.Note that this will **not** rename the real file but **copy** it.

####doCopy
Type: `Boolean`
Default value: `false`
Since: 0.5.0

Copy instead of rename when `changeFileName` is set to true.

#### regex
Type: `Object`
Default value: `{}`

Custom search pattern defination.Ex:

    regex: {
      '@': {
        pattern: /@([\w\/.]+)@/,
        index: 1,//filepath is in RegExp.$1
        whole: true //replace whole pattern,including the '@' on the both sides
      }
    }

#### buildFileName
Type: `Function`
Default value: ``

Custom filename building function.This is only useful when `changeFileName` is set to true.Ex:

    function(filename, filext, stamp){
      return filename + '_' + stamp + '.' + filext;
    }

#### fileStamp
Type: `Function`
Default value: `null`

A function calculates a file's stamp,the file path is the parameter passed in ,Ex:

    function(path){
      return md5(path) + Date.now();
    }


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


[npm-url]: https://npmjs.org/package/grunt-web-stamp
[downloads-image]: http://img.shields.io/npm/dm/grunt-web-stamp.svg
[npm-image]: http://img.shields.io/npm/v/grunt-web-stamp.svg
[travis-url]: https://travis-ci.org/yanni4night/grunt-web-stamp
[travis-image]: http://img.shields.io/travis/yanni4night/grunt-web-stamp.svg
[appveyor-image]:https://ci.appveyor.com/api/projects/status/bsu9w9ar8pboc2nj?svg=true
[appveyor-url]:https://ci.appveyor.com/project/yanni4night/grunt-web-stamp
[david-dm-url]:https://david-dm.org/yanni4night/grunt-web-stamp
[david-dm-image]:https://david-dm.org/yanni4night/grunt-web-stamp.svg
[david-dm-dev-url]:https://david-dm.org/yanni4night/grunt-web-stamp#info=devDependencies
[david-dm-dev-image]:https://david-dm.org/yanni4night/grunt-web-stamp/dev-status.svg
[coveralls-url]:https://coveralls.io/r/yanni4night/grunt-web-stamp?branch=master
[coveralls-image]:https://coveralls.io/repos/yanni4night/grunt-web-stamp/badge.png?branch=master
[grunt-url]:http://gruntjs.com/
[grunt-image]: https://cdn.gruntjs.com/builtwith.png
