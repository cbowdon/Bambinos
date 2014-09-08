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
            tasks: 'typescript',
            files: sources.concat(tests)
        },
        copy: {
            dist: {
                expand: true,
                src: [
                  'node_modules/mithril/mithril.js',
                  'build/*.js',
                  'build/*.d.ts'
                ],
                dest: 'dist/',
                flatten: true
            }
        }
    });

    grunt.registerTask('default', 'Compiles TypeScript', [ 'typescript', 'copy' ]);
};
