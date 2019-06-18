
const gulp = require('gulp')
const P = require('gulp-load-plugins')()
const del = require('del')

const tsProject = P.typescript.createProject('tsconfig.json');
const tscFiles = 'src/**.ts'
const assetsFiles = 'src/assets/**/*.{png,svg,jpg,js}'
const pluginDefinition = 'plugin.json'
const readme = 'README.md'
const templateFiles = 'src/partials/*.pug'
const styleFiles = ['src/style/light.less', 'src/style/dark.less']


gulp.task('tsc', (done) => {
    gulp
    .src(tscFiles)
    .pipe(tsProject())
    .pipe(gulp.dest('dist/'))
    .pipe(P.livereload());
    done();
})

gulp.task('pug', (done) => {
    gulp
    .src(templateFiles)
    .pipe(P.pug({}))
    .pipe(gulp.dest('dist/template'))
    .pipe(P.livereload());
    done();
})

gulp.task('less', (done) => {
    gulp
    .src(styleFiles)
    .pipe(P.less({}))
    .pipe(gulp.dest('dist/style'))
    .pipe(P.livereload());
    done();
})

gulp.task('assets', (done) => {
    gulp
    .src(assetsFiles)
    .pipe(gulp.dest('dist/assets'))
    .pipe(P.livereload());
    done();
})

gulp.task('plugin', (done) => {
    gulp
    .src([pluginDefinition, readme])
    .pipe(gulp.dest('dist/'))
    .pipe(P.livereload());
    done();
})

gulp.task('clean', (done) => {
    del(['dist/']);
    done;
})

gulp.task('watch', (done) => {
    P.livereload.listen()
    gulp.watch(tscFiles, gulp.series('tsc'))
    gulp.watch(assetsFiles, gulp.series('assets'))
    gulp.watch([pluginDefinition, readme], gulp.series('plugin'))
    gulp.watch(templateFiles, gulp.series('pug'))
    gulp.watch('src/style/**.less', gulp.series('less'));
    done();
})


gulp.task('build', gulp.series('assets', 'tsc', 'pug', 'less', 'plugin'))
gulp.task('default', gulp.series('build', 'watch'))