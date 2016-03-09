'use strict';

module.exports = function (grunt) {


	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Configurable paths
	var config = {
		app: './src',
		dist: './dist'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		config: config,

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= config.app %>/content/script/{,*/}*.js'],
				tasks: ['jshint']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			styles: {
				files: ['<%= config.app %>/content/styles/{,*/}*.css'],
				tasks: ['autoprefixer']
			},
			sass: {
				files: '<%= config.app %>/content/styles/{,*/}*.scss',
				tasks: ['sass:dev']
			}
		},
		browserSync: {
			bsFiles: {
				src : '<%= config.app %>/**'
			},
			options: {
				//proxy: "local.dev", // Por si se está usando un servidor externo (apache, iis...etc)
				server: {
					baseDir: '<%= config.app %>'
				},
				watchTask: true

			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [
					{
						dot: true,
						src: [
							'.tmp',
							'<%= config.dist %>/*',
							'!<%= config.dist %>/.git*'
						]
					}
				]
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= config.app %>/scripts/{,*/}*.js',
				'!<%= config.app %>/scripts/vendor/*'
			]
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
			},
			dist: {
				files: [
					{
						expand: true,
						src: '<%= config.app %>/content/styles/{,*/}*.css',
						dest: '<%= config.app %>/content/styles'
					}
				]
			}
		},

		// The following *-min tasks produce minified files in the dist folder
		imagemin: {
			//png: {
			//    options: {
			//        optimizationLevel: 7
			//    },
			//    files: [
			//        {
			//            expand: true,
			//            cwd: '<%= config.app %>/content/imgs',
			//            src: ['**/*.png'],
			//            dest: '<%= config.dist %>/content/imgs',
			//            ext: '.png'
			//        }
			//    ]
			//},
			jpg: {
				options: {
					progressive: true
				},
				files: [
					{
						expand: true,
						cwd: '<%= config.app %>/content/imgs',
						src: ['**/*.jpg'],
						dest: '<%= config.dist %>/content/imgs',
						ext: '.jpg'
					}
				]
			}
		},
		svgmin: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= config.app %>/content/imgs',
						src: '{,*/}*.svg',
						dest: '<%= config.dist %>/content/imgs'
					}
				]
			}
		},

		htmlmin: {
			dist: {
				options: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					conservativeCollapse: true,
					removeAttributeQuotes: true,
					removeCommentsFromCDATA: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true,
					removeRedundantAttributes: true,
					useShortDoctype: true
				},
				files: [
					{
						expand: true,
						cwd: '<%= config.dist %>',
						src: '{,*/}*.html',
						dest: '<%= config.dist %>'
					}
				]
			}
		},
		requirejs: {
			dist: {
				options: {
					baseUrl: "<%= config.app %>/content/script",
					mainConfigFile: '<%= config.app %>/content/script/main.js',
					include: ['requireLib','main'],
					name: "main",
					out: "<%= config.dist %>/content/script/main-built.js",
					preserveLicenseComments: false,
					paths: {
						requireLib: "require"
					}
				}
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed',
					sourcemap: 'none'
				},
				files: {
					'<%= config.dist %>/content/styles/global.css': '<%= config.app %>/content/styles/global.scss'
				}
			},
			dev: {
				options: {
					style: 'nested',
					sourcemap: 'auto'
				},
				files: {
					'<%= config.app %>/content/styles/global.css': '<%= config.app %>/content/styles/global.scss'
				}
			}
		},
		processhtml: {
			dist: {
				options: {
				},
				files: {
					'<%= config.dist %>/index.html': ['<%= config.app %>/index.html']
				}
			}
		},
		// By default, your `index.html`'s <!-- Usemin block --> will take care
		// of minification. These next options are pre-configured if you do not
		// wish to use the Usemin blocks.
		// cssmin: {
		//   dist: {
		//     files: {
		//       '<%= config.dist %>/styles/main.css': [
		//         '.tmp/styles/{,*/}*.css',
		//         '<%= config.app %>/styles/{,*/}*.css'
		//       ]
		//     }
		//   }
		// },
		// uglify: {
		//   dist: {
		//     files: {
		//       '<%= config.dist %>/scripts/scripts.js': [
		//         '<%= config.dist %>/scripts/scripts.js'
		//       ]
		//     }
		//   }
		// },
		// concat: {
		//   dist: {}
		// },

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= config.app %>',
						dest: '<%= config.dist %>',
						src: [
							'*.{ico,png,txt}',
							'content/imgs/{,*/}*.webp',
							'content/fonts/{,*/}*.*',
							'content/pdf/**',
							'content/css',
							'bin/*.*',
							'Views/**'
						]
					}/*,
					 {
					 src: 'node_modules/apache-server-configs/dist/.htaccess',
					 dest: '<%= config.dist %>/.htaccess'
					 }*/
				]
			}
		},

		// Run some tasks in parallel to speed up build process
		concurrent: {
			dist: [
				'tinypng',
				'imagemin',
				'requirejs',
				'sass',
				'processhtml'
			]
		},
		tinypng: {
			options: {
				apiKey: "L9ZDhpvYdvZgq0RMZwMph0UrGPksa5om",
				checkSigs: true,
				sigFile: "tinypng.sig",
				summarize: true,
				showProgress: true
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= config.app %>/content/imgs',
						src: ['**/*.png'],
						dest: '<%= config.dist %>/content/imgs',
						ext: '.png'
					}
				]
			}
		}
	});

	grunt.registerTask('serve', 'start the server and preview your app', function () {
		grunt.task.run([
			'browserSync',
			'watch'
		]);
	});

	grunt.registerTask('build', [
		'clean:dist',
		'copy:dist',
		'concurrent:dist'
	]);
};
