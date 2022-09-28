module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-release');
  grunt.renameTask('release', 'gruntRelease');

  grunt.initConfig({
    gruntRelease: {
      options: {
        npm: true,
        additionalFiles: ['package-lock.json'],
      },
    },
  });

  grunt.registerTask('release', ['gruntRelease']);
};
