/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global module,require*/
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        open: {
            chrome: {
                path: 'http://'+require("os").hostname()+':8282/search/catalog/',
                app: 'Google Chrome'
            }
        },
        'webpack-dev-server': {
            options: {
                historyApiFallBack: true,
                inline: false,
                hot: true,
				webpack: require(grunt.option("webpackConfig")),
                contentBase: 'src/main/resources/',
                proxy: {
                    '/search/**': {
                        target: 'https://localhost:8993',
                        secure: false,
                        changeOrigin: true
                    },
                    '/services/**': {
                        target: 'https://localhost:8993',
                        secure: false,
                        changeOrigin: true
                    },
                    '/css/**': {
                        target: 'https://localhost:8993/search/catalog',
                        secure: false,
                        changeOrigin: true
                    },
                    '/fonts/**': {
                        target: 'https://localhost:8993/search/catalog/css',
                        secure: false,
                        changeOrigin: true
                    }
                }
			},
			start: {
				keepAlive: true,
				webpack: {
					devtool: "eval",
					debug: true
				}
			}
        },
        webpack: {
            build: require(grunt.option("webpackConfig"))
        },
        jshint: {
            all: {
                src: [
                    'Gruntfile.js',
                    'src/main/webapp/js/**/*.js',
                    'src/main/webapp/config.js',
                    'src/main/webapp/main.js',
                    'src/main/webapp/properties.js',
                    'src/test/js/**/*.js'
                ]
            },
            options: {
                asi: true,            // tolerate automatic semicolon insertion
                bitwise: true,        // Prohibits the use of bitwise operators such as ^ (XOR), | (OR) and others.
                forin: true,          // Requires all for in loops to filter object's items.
                latedef: true,        // Prohibits the use of a variable before it was defined.
                newcap: true,         // Requires you to capitalize names of constructor functions.
                noarg: true,          // Prohibits the use of arguments.caller and arguments.callee. Both .caller and .callee make quite a few optimizations impossible so they were deprecated in future versions of JavaScript.
                noempty: true,         // Warns when you have an empty block in your code.
                regexp: true,         // Prohibits the use of unsafe . in regular expressions.
                undef: true,          // Prohibits the use of explicitly undeclared variables.
                unused: true,         // Warns when you define and never use your variables.
                maxlen: 250,          // Set the maximum length of a line to 250 characters.  If triggered, the line should be wrapped.
                eqeqeq: true,         // Prohibits the use of == and != in favor of === and !==

                // Relaxing Options
                scripturl: true,      // This option suppresses warnings about the use of script-targeted URLsâ€”such as

                reporter: require('jshint-stylish'),

                // options here to override JSHint defaults
                globals: {
                    console: true,
                    module: true,
                    define: true
                }
            }
        },
        express: {
            options: {
                port: 8282,
                hostname: '*'
            },
            server: {
                options: {
                    script: './server.js'
                }
            }
        },
        watch: {
            app: {
				files: ["src/**/*"],
				tasks: ["webpack:build"],
				options: {
					spawn: false,
				}
			}
        }
    });

    grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask('build:part', [
        'jshint'
    ]);

    grunt.registerTask('build', [
        'build:part',
        'webpack:build'
    ]);

    grunt.registerTask('start', [
        'webpack-dev-server:start',
    ]);

    grunt.registerTask('startplus', [
        'open:chrome',
        'start'
    ]);

    grunt.registerTask('default', [
        'build:part',
        'express:server',
        'watch'
    ]);
};
