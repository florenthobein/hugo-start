'use strict';

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	var tasks = {

		pkg: grunt.file.readJSON('package.json'),
		vendor: grunt.file.readJSON('.bowerrc'),
		name_asset: '<%= pkg.name.replace(/_/g, \'-\') %>',

		// Clean
		clean: {
			assets: ['static/css', 'static/js'],
			dev: ['build/dev'],
			dist: ['build/dist'],
		},

		// Compiles LESS files to CSS
		less: {
			dev: {
				paths: ['less/'],
				src: ['less/main.less'],
				dest: 'static/css/<%= name_asset %>.<%= pkg.version %>.css'
			},
			dist: {
				paths: ['less/'],
				src: ['less/main.less'],
				dest: 'static/css/<%= name_asset %>.<%= pkg.version %>.min.css',
				options: {
					plugins: [
						new (require('less-plugin-autoprefix'))({
							browsers: ['> 0.1%']
						}), new (require('less-plugin-clean-css'))({})
					]
				}
			}
		},

		// Concatenate the JS
		concat: {
			options: {
				stripBanners: true,
				banner: '/* <%= pkg.name %> v<%= pkg.version %> | ' +
					'<%= pkg.author.name %> */\n',
			},
			js: {
				src: ['js/**/*.js'],
				dest: 'static/js/<%= name_asset %>.<%= pkg.version %>.js',
			}
		},

		// Uglyfy the JS
		uglify: {
			options: {
				sourceMap: true
			},
			dist: {
				src: 'static/js/<%= name_asset %>.<%= pkg.version %>.js',
				dest: 'static/js/<%= name_asset %>.<%= pkg.version %>.min.js'
			}
		},

		// Copy
		copy: {
			vendor: {
				files: [
					{
						cwd: '<%= vendor.directory %>',
						src: [ '**' ],
						dest: 'static/lib/',
						expand: true
					}
				]
			}
		},

		// Wire the lib
		wiredep: {
			vendor: {
				directory: 'static/lib/',
				src: [ 'layouts/**/*.html' ],
				onMainNotFound: function(pkg) {
					var str = "The package `" + pkg + "` doesn't have a `main` field.";
					grunt.log.errorlns(str['red']);
					grunt.log.errorlns("More info: https://www.npmjs.com/package/wiredep#what-can-go-wrong");
				},
			}
		},

		// Bump
		semver: {
			release: {
				files: [{
					src: 'package.json',
					dest: 'package.json'
				}]
			},
		},

		// Watch
		watch: {
			options: {
				atBegin: true,
				livereload: true
			},
			less: {
				files: ['less/**/*.less'],
				tasks: ['less:dev']
			},
			concat: {
				files: ['js/**/*.js'],
				tasks: ['concat:js']
			},
			hugo: {
				files: ['static/**', 'layouts/**', 'config.toml'],
				tasks: 'hugo:dev'
			},
		},

		// Create live site
		connect: {
			website: {
				options: {
					hostname: 'localhost',
					port: 9000,
					protocol: 'http',
					base: 'build/dev',
					livereload: true
				}
			}
		},

		// Unit tests
		nodeunit: {
			tests: ['tests/*_test.js']
		}
	};

	grunt.initConfig( tasks );

	// Create the hugo task
	grunt.registerTask('hugo', function(target) {

		// Make it asynchronous
		var done = this.async();

		var args = [ '--destination=build/' + target ],
			opts = { stdio: 'inherit' };
		if (target === 'dev') {
			args.push('--baseUrl=http://localhost:9000/');
			args.push('--buildDrafts=true');
			args.push('--buildFuture=true');
		}

		// Spawn the process
		var p = require('child_process').spawn('hugo', args, opts),
			events = { close: 'process closed', error: 'process error', exited: 'process exited' },
			res = [];
		for (var e in events) {
			var text = events[e];
			res.push(p.on(e, function(code) { console.log(text+' (code '+code+')'); return done(true); }));
		}
		return res;
	});

	// Register tasks
	grunt.registerTask('test', [
		'clean',
		'dev',
		'dist',
		'nodeunit'
	]);
	grunt.registerTask('dev', [
		'clean:assets',
		'clean:dev',
		'less:dev',
		'concat:js',
		'copy:vendor',
		'hugo:dev'
	]);
	grunt.registerTask('dist', [
		'clean:assets',
		'clean:dist',
		'less:dist',
		'concat:js',
		'uglify',
		'copy:vendor',
		'hugo:dist'
	]);
	grunt.registerTask('bump', 'Bump the package', function(param) {
		param = param || 'patch';
		grunt.task.run('semver:release:bump:' + param);
	});
	grunt.registerTask('default', [
		'connect', 'watch'
	]);

};