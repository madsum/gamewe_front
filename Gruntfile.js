'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var backboneConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        backbone: backboneConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            coffee: {
                files: ['<%= backbone.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= backbone.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= backbone.app %>/*.html',
                    '{.tmp,<%= backbone.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= backbone.app %>}/scripts/{,*/}*.js',
                    '<%= backbone.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    '<%= backbone.app %>/scripts/templates/*.{ejs,mustache,hbs}',
                    'test/spec/**/*.js'
                ]
            },
            handlebars: {
                files: [
                    '<%= backbone.app %>/scripts/templates/{,*/}*.hbs'
                ],
                tasks: ['handlebars']
            }
        },
        connect: {
            options: {
                port: SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, backboneConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, backboneConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, backboneConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            },
            test: {
                path: 'http://localhost:<%= connect.test.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= backbone.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= backbone.app %>/scripts/{,*/}*.js',
                '!<%= backbone.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        jasmine: {
            all:{
                src : '/scripts/{,*/}*.js',
                options: {
                    keepRunner: true,
                    specs : 'test/spec/**/*.js',
                    vendor : [
                        '<%= backbone.app %>/bower_components/jquery/dist/jquery.js',
                        '<%= backbone.app %>/bower_components/underscore/underscore.js',
                        '<%= backbone.app %>/bower_components/backbone/backbone.js',
                        '.tmp/scripts/templates.js'
                    ]
                }
            }
        },
        coffee: {
            dist: {
                files: [{
                    // rather than compiling multiple files here you should
                    // require them into your main .coffee file
                    expand: true,
                    cwd: '<%= backbone.app %>/scripts',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/scripts',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/spec',
                    ext: '.js'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= backbone.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= backbone.app %>/images',
                javascriptsDir: '<%= backbone.app %>/scripts',
                fontsDir: '<%= backbone.app %>/styles/fonts',
                importPath: '<%= backbone.app %>/bower_components',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    baseUrl: '<%= backbone.app %>/scripts',
                    optimize: 'none',
                    paths: {
                        'templates': '../../.tmp/scripts/templates',
                        'jquery': '../../app/bower_components/jquery/dist/jquery',
                        'underscore': '../../app/bower_components/underscore/underscore',
                        'backbone': '../../app/bower_components/backbone/backbone'
                        // 'text': '../../app/bower_components/requirejs-text/text'
                    },
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    name: 'main',
                    out: '<%= backbone.dist %>/scripts/main.js',
                    mainConfigFile: '<%= backbone.app %>/scripts/main.js'
                    // wrap: true,
                    // inlineText: true,
                    // stubModules: ['text'],
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        useminPrepare: {
            html: '<%= backbone.app %>/index.html',
            options: {
                dest: '<%= backbone.dist %>'
            }
        },
        usemin: {
            html: ['<%= backbone.dist %>/{,*/}*.html'],
            css: ['<%= backbone.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= backbone.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= backbone.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= backbone.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= backbone.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= backbone.app %>/styles/{,*/}*.css'
                        // '<%= backbone.app %>/bower_components/jstree/dist/themes/default/style.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= backbone.app %>',
                    src: '*.html',
                    dest: '<%= backbone.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= backbone.app %>',
                    dest: '<%= backbone.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/{,*/}*.*',
                        'locales/{,*/}*.*',
                        'bower_components/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*',
                        'bower_components/font-awesome/fonts/*'
                    ]
                },
                {
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= backbone.app %>',
                    dest: '<%= backbone.dist %>/styles/bootstrap-daterangepicker/',
                    src: [
                        'bower_components/bootstrap-daterangepicker/*.css'
                    ]
                },
                {
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= backbone.app %>',
                    dest: '<%= backbone.dist %>/styles/jquery-ui/themes/smoothness/',
                    src: [
                        'bower_components/jquery-ui/themes/smoothness/*'
                    ]
                },
                {
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= backbone.app %>',
                    dest: '<%= backbone.dist %>/styles/qtip2/',
                    src: [
                        'bower_components/qtip2/jquery.qtip.min.css'
                    ]
                },
                {
                    src: '<%= backbone.app %>/bower_components/requirejs/require.js',
                    dest: '<%= backbone.dist %>/bower_components/requirejs/require.js'
                },
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= backbone.app %>/../../Hukka/Collection/locales',
                    src: '{,*/}*.*',
                    dest: '<%= backbone.dist %>/locales'
                }
                ]
            },
            serve: {
                files: [
                {
                    src: '<%= backbone.app %>/web.serve.config',
                    dest: '<%= backbone.dist %>/web.config'
                },
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= backbone.app %>/../../Hukka/Collection/locales',
                    src: '{,*/}*.*',
                    dest: '<%= backbone.app %>/locales'
                }
                ]
            },
        },
        bower: {
            all: {
                rjsConfig: '<%= backbone.app %>/scripts/main.js'
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: 'JST',
                    amd: true,
                    wrapped: true
                },
                files: {
                    '.tmp/scripts/templates.js': ['<%= backbone.app %>/scripts/templates/{,*/}*.hbs']
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= backbone.dist %>/scripts/{,*/}*.js',
                        '<%= backbone.dist %>/styles/{,*/}*.css',
                        // '<%= backbone.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '/styles/fonts/{,*/}*.*',
                        '<%= backbone.dist %>/bower_components/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*',
                        '<%= backbone.dist %>/bower_components/font-awesome/fonts/*',
                        '<%= backbone.dist %>/bower_components/jstree/dist/themes/default/*.{png,jpg,jpeg,gif,webp}'
                    ]
                }
            }
        },
        jsdoc : {
            dist : {
                src: ['<%= backbone.app %>/scripts/{,*/}*.js', 'test/*.js'],
                options: {
                    destination: 'jsdoc'
                }
            }
        }
    });

    grunt.registerTask('createDefaultTemplate', function () {
        grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open:server', 'connect:dist:keepalive']);
        }

        if (target === 'test') {
            return grunt.task.run([
                'clean:server',
                'coffee',
                'createDefaultTemplate',
                'handlebars',
                'compass:server',
                'connect:test',
                'open:test',
                'watch:livereload'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'coffee:dist',
            'createDefaultTemplate',
            'handlebars',
            'copy:serve',
            'compass:server',
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });

    grunt.registerTask('test', function (isConnected) {
        isConnected = Boolean(isConnected);
        var testTasks = [
                'clean:server',
                'coffee',
                'createDefaultTemplate',
                'handlebars',
                'compass',
                'jasmine',
                'watch:test'
            ];
            
        if(!isConnected) {
            return grunt.task.run(testTasks);
        } else {
            // already connected so not going to connect again, remove the connect:test task
            testTasks.splice(testTasks.indexOf('connect:test'), 1);
            return grunt.task.run(testTasks);
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'coffee',
        'createDefaultTemplate',
        'handlebars',
        'compass:dist',
        'useminPrepare',
        'requirejs',
        'imagemin',
        'htmlmin',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        'rev',
        'usemin',
        'jsdoc'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
