
const gulp = require('gulp')
const P = require('gulp-load-plugins')()
const del = require('del')

const tsProject = P.typescript.createProject('tsconfig.json');
const tscFiles = 'src/**.ts'
const assetsFiles = 'src/assets/**/*.{png,svg,jpg,js}'
const pluginDefinition = 'src/plugin.json'
const readme = 'README.md'
const templateFiles = 'src/template/*.pug'
const styleFiles = ['src/style/light.less', 'src/style/dark.less']

gulp.task('build', ['assets', 'tsc', 'pug', 'less', 'plugin'])
gulp.task('default', ['build', 'watch'])

gulp.task('tsc', () => {
    return gulp
    .src(tscFiles)
    .pipe(P.plumberNotifier())
    .pipe(tsProject())
    .pipe(gulp.dest('dist/'));
})

gulp.task('pug', () => {
    return gulp
    .src(templateFiles)
    .pipe(P.plumberNotifier())
    .pipe(P.pug({}))
    .pipe(gulp.dest('dist/template'));
})

gulp.task('less', () => {
    return gulp
    .src(styleFiles)
    .pipe(P.plumberNotifier())
    .pipe(P.less({}))
    .pipe(gulp.dest('dist/style'));
})

gulp.task('assets', () => {
    gulp
    .src(assetsFiles)
    .pipe(P.plumberNotifier())
    .pipe(gulp.dest('dist/assets'))
})

gulp.task('plugin', () => {
    gulp
    .src([pluginDefinition, readme])
    .pipe(P.plumberNotifier())
    .pipe(gulp.dest('dist/'))
})

gulp.task('clean', () => {
    return del(['dist/']);
})

gulp.task('watch', () => {
    gulp.watch(tscFiles, ['tsc'])
    gulp.watch(assetsFiles, ['assets'])
    gulp.watch([pluginDefinition, readme], ['plugin'])
    gulp.watch(templateFiles, ['pug'])
    gulp.watch('src/style/**.less', ['less'])
})
