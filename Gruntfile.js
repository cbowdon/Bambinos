module.exports = function (grunt) {
    'use strict';

    var sources = [ 'src/*.ts' ],
        tests   = [ 'test/*.ts' ];

    grunt.loadNpmTasks('grunt-typescript');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        typescript: {
            options: {
                sourceMap: true,
                noImplicitAny: true,
                declaration: true,
                comments: true
            },
            main: {
                src: sources,
                dest: 'build/bambino.js'
            },
            test: {
                src: tests,
                dest: 'test/build/bambino-test.js'
            }
        },
        watch: {
            tasks: [ 'typescript', 'copy' ],
            files: sources.concat(tests)
        },
        copy: {
            distJs: {
                expand: true,
                src: [
                  'node_modules/mithril/mithril.js',
                  'node_modules/moment/moment.js',
                  'node_modules/underscore/underscore.js',
                  // Ran once, now in SC
                  //'bower_components/bootstrap/dist/js/bootstrap.min.js',
                  //'bower_components/jquery/dist/jquery.min.js',
                  'build/*.js',
                  'build/*.d.ts',
                  'src/*.js'
                ],
                dest: 'dist/js',
                flatten: true
            },
            distCss: {
                expand: true,
                src: [
                  // Ran once, now in SC
                  //'bower_components/bootstrap/dist/css/bootstrap.min.css',
                ],
                dest: 'dist/css',
                flatten: true
            },
            distFonts: {
                expand: true,
                src: [
                  // Ran once, now in SC
                  //'bower_components/bootstrap/dist/fonts/*',
                ],
                dest: 'dist/fonts',
                flatten: true
            }
        }
    });

    grunt.registerTask('default', 'Compiles TypeScript', [ 'typescript', 'copy' ]);
};
