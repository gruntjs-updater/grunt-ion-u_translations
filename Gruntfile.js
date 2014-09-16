/*
 * grunt-ion-u_translations
 * https://github.com/wirsich/grunt-ion-u_translations
 *
 * Copyright (c) 2014 Stephan Wirsich
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    ion_u_translations: {
      options: {
        endpoint: 'https://cs-languageportal-beta.webvariants.de/api/gettranslations',
      },
      de_de: {
        options: {
          locale: 'de_de'
        },
        files: {
          'tmp/de_de.json': ['de_de.json']
        }
      },
      fr_fr: {
        options: {
          locale: 'fr_fr'
        },
        files: {
          'tmp/fr_fr.json': ['fr_fr.json']
        }
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'ion_u_translations', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
