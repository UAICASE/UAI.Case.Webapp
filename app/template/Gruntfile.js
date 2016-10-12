module.exports = function(grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  var pkg = grunt.file.readJSON('package.json');

  var options = {
    paths: {
      app: 'app',
      assets: 'app/assets',
      dist: 'app/dist',
      distAssets: 'app/dist/assets',
      html: 'app/html',
      htmlAssets: 'app/html/assets',
      index: 'app/dist/index.html',
      indexDev: 'app/index.dev.html'
    },
    pkg: pkg
  };

  // Load grunt configurations automatically
  var configs = require('load-grunt-configs')(grunt, options);

  // Define the configuration for all the tasks
  grunt.initConfig(configs);

  grunt.registerTask('bumper', ['bump-only']);
  grunt.registerTask('css', ['sass']);
  grunt.registerTask('default', ['sass', 'copy:dev', 'watch']);

  grunt.registerTask('shared',[
    'sass',
    'ngconstant',
    'copy:demo',
    'useminPrepare',
    'concat:generated',
    'cssmin',
    'uglify:generated',
    'filerev',
    'usemin',
    'imagemin',
    'usebanner'
  ]);

  grunt.registerTask('demo',[
    'clean:demo',
    'grep:demo',
    'shared'
  ]);

  grunt.registerTask('dist',[
    'clean:demo',
    'grep:dist',
    'shared',
    'compress'
  ]);

  grunt.registerTask('html',[
    'clean:html',
    'copy:html',
    'concat:html',
    'htmlSnapshot',
    'prettify:html',
    'uglify:html',
  ]);
};
