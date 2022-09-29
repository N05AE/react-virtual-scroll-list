module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-release');
  grunt.renameTask('release', 'gruntRelease');

  grunt.initConfig({
    gruntRelease: {
      options: {
        npm: false,
        additionalFiles: ['package-lock.json'],
      },
    },
  });

  grunt.registerTask('release', ['gruntRelease']);
};
