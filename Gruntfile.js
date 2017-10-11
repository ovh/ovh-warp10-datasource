module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.initConfig({

    clean: ['dist'],

    copy: {
      partials_to_dist: {
        cwd: 'src',
        expand: true,
        src: [
          'partials/*',
        ],
        dest: 'dist',
      },
      img_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['img/*'],
        dest: 'dist/',
      },
      pluginDef: {
        expand: true,
        src: ['plugin.json', 'README.md'],
        dest: 'dist',
      },
    },

    watch: {
      rebuild_less: {
        files: ['src/css/**.less'],
        tasks: ['less:prod'],
      },
      rebuild_partial: {
        files: ['src/partials/**.html'],
        tasks: ['copy:partials_to_dist'],
      },
      rebuild_img: {
        files: ['src/img/**'],
        tasks: ['copy:img_to_dist'],
      },
      rebuild_js: {
        files: ['src/*.js'],
        tasks: ['babel:dist'],
      },
      rebuild_plugin: {
        files: ['src/*.(json|md'],
        tasks: ['copy:pluginDef'],
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015'],
      },
      dist: {
        options: {
          plugins: ['transform-es2015-modules-systemjs', 'transform-es2015-for-of'],
        },
        files: [{
          cwd: 'src',
          expand: true,
          src: ['**/*.js'],
          dest: 'dist',
          ext: '.js',
        }],
      },
      distTestNoSystemJs: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['**/*.js'],
          dest: 'dist/test',
          ext: '.js',
        }],
      },
      distTestsSpecsNoSystemJs: {
        files: [{
          expand: true,
          cwd: 'spec',
          src: ['**/*.js'],
          dest: 'dist/test/spec',
          ext: '.js',
        }],
      },
    },

    less: {
      prod: {
        files: {
          'dist/css/app.css': 'src/css/*.less',
        },
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['dist/test/spec/test-main.js', 'dist/test/spec/*_spec.js'],
      },
    },
  });

  grunt.registerTask('default', [
    'clean',
    'copy:partials_to_dist',
    'copy:img_to_dist',
    'copy:pluginDef',
    'less:prod',
    'babel',
    /* 'mochaTest'*/
  ]);
};
