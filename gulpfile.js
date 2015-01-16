var gulp = require('gulp');
var to5 = require('gulp-6to5');

gulp.task('default', function () {
    return gulp.src('src/script.js')
    .pipe(to5())
    .pipe(gulp.dest('js'));
});


gulp.task('watch', ['default'], function() {
    gulp.watch('src/script.js', ['default']);
});
