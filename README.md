# grunt-web-stamp

> Add timestamp to the url path.It search `<img/>`,`<link/>`,`<script/>` and `url()` to resolve
> every path and calculate timestamp to append to it.

## Getting Started
This plugin requires Grunt `~0.4.4`

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

#### options.baseDir
Type: `String` or `Function`
Default value: `'.'`

A string value that is indicating where the resource files are.

You can assign a function instead:

    {
        "baseDir":function(targetFilePath){return "static/";}
    }

#### options.prefix
Type: `String`
Default value: `''`

A string value that will be prepended to each url path.

#### options.pattern
Type: `String` or `Function`
Default value: `'ulsi'`

A char sequence indicates which kinds of url should be handled.

 - 'i':`<img/>`
 - 'l':`<link/>`
 - 'u':`url()`
 - 's':`<script/>`

You can make any combination of them,they're case-sensitive.

You can assign a function instead.

    {
        "pattern":function(filepath){return /\.html$/.test(filepath)?"lis":"u";}
    }

#### options.stampName
Type: `String`
Default value: `'t'`

Query name for the timestamp.

#### options.crypto
Type: `String`
Default value: `'md5'`

A crypto algorithm name.More available names are `sha1`,`sha256` and `sha512`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


