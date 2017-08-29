Hugo Start
===

Simple [hugo](https://gohugo.io/) backbone using [bower](https://bower.io/) for public library management, [LESS](http://lesscss.org/) as a style preprocessor & the [grunt](https://gruntjs.com/) task runner

## Features

- Static generation ;
- Live reload for development ;
- Support for LESS ;
- Support for i18n ;
- Assets processing ;
- Because the hugo structure is kept intact, you can still use the `hugo` CLI.

## Installation

```
npm install
```

## Usage

```
grunt init && grunt
```

## Deployment

```
grunt dist
```

The folder `build/dist/` will contain the static site ready for production.

## How To...

### ...add a new external library

After adding the desired library by its `bower install` command, run `grunt init` to wire the libraries in the layout.

### ...modify the name of the compiled css/js files

You can bump the package by using the task `grunt bump` that will change the semver version of the package. If you want to modify the `minor` or `major` version of the package, use `grunt bump:minor` or `grunt bump:major`.

### ...modify a text

Either in the corresponding page file in the `content/` folder, or in the `i18n/` folder.

## License

Copyright (c) 2017 Florent Hobein. Licensed under the MIT license.