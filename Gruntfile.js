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
      }
    }
  });
}