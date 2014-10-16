'use strick';

module.exports = function(grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      configFiles: {
        files: ['Gruntfile.js', 'package.json'],
        options: {
          reload: true
        }
      },
      js: {
        files: ['lib/*.js'],
        tasks: ['browserify']
      }
    },
    mochacli: {
      options: {
        require: ['should'],
        reporter: 'nyan'
      },
      all: ['test/*.js']
    },
    browserify: {
      dist: {
        files: {
          'seren.js': 'lib/module.js'
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'seren.min.js': 'seren.js'
        }
      }
    }
  });

  grunt.registerTask('test', ['mochacli']);
  grunt.registerTask('build', ['browserify', 'uglify']);
}