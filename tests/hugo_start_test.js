'use strict';

var grunt = require('grunt');

var read = function(src) {
  return grunt.util.normalizelf(grunt.file.read(src));
};

var pkg = grunt.file.readJSON('package.json'),
	name_asset = pkg.name.replace(/_/g, '-');

exports.hugo_start = {

	// it should generate a dev build
	dev: function(test) {
		test.expect(2);

		test.ok(grunt.file.isDir('build/dev'), 'it should generate a dev build');
		test.ok(grunt.file.exists('build/dev/index.html'), 'it should generate an index.html file');

		test.done();
	},

	// it should parse the assets
	assets: function(test) {
		test.expect(2);

		test.ok(grunt.file.exists('build/dev/js/'+name_asset+'.'+pkg.version+'.js'), 'it should create a JS file');
		test.ok(grunt.file.exists('build/dev/css/'+name_asset+'.'+pkg.version+'.css'), 'it should create a CSS file');

		test.done();
	},

	// it should generate a dist build
	dist: function(test) {
		test.expect(2);

		test.ok(grunt.file.isDir('build/dist'), 'it should generate a dist build');
		test.ok(grunt.file.exists('build/dist/index.html'), 'it should generate an index.html file');

		test.done();
	},

	// it should parse the assets for dist
	assets_min: function(test) {
		test.expect(2);

		test.ok(grunt.file.exists('build/dist/js/'+name_asset+'.'+pkg.version+'.min.js'), 'it should create a JS file');
		test.ok(grunt.file.exists('build/dist/css/'+name_asset+'.'+pkg.version+'.min.css'), 'it should create a CSS file');

		test.done();
	},
};
