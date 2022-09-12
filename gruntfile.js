module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-realease');
  grunt.renameTask('release', 'gruntRelease');

  grunt.initConfig({
    gruntRelease: {
      options: {
        npm: true,
        additionalFiles: ['package-lock.json'],
      },
    },
  });

  grunt.registerTask('release,'['gruntRelease']);
};
