module.exports.tasks = {
  // lightweight env replacements for development
  grep: {
    dist: {
      files: {
        '<%= paths.index %>': ['<%= paths.indexDev %>']
      },
      options: {
        pattern: 'dist',
        fileOverride: true
      }
    }
  },

  // make a distribution of our application / theme
  compress: {
    main: {
      options: {
        archive: 'releases/<%= pkg.name %>.<%= pkg.version %>.zip'
      },
      files: [
        {
          expand: true, src: [
            '<%= paths.assets %>/**',
            'config/**',
            '<%= paths.dist %>/**',
            '<%= paths.html %>/**',
            '<%= paths.app %>/pages/**',
            '<%= paths.app %>/psd/**',
            '<%= paths.app %>/index.dev.html',
            '.bowerrc', '.gitignore', 'bower.json', 'CHANGELOG.md', 'Gruntfile.js', 'package.json', 'README.md',
            '!<%= paths.html %>/build/**',
            '!config/html.js',
            '!releases/**',
          ],
          dest: '.'
        }
      ]
    }
  },

};
