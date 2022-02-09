var gulp = require('gulp');
var scss = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');
var htmlbeautify = require('gulp-html-beautify');
var del = require('del');

// 소스 파일 경로
var PATH = {
    HTML: './src/html'
    , ASSETS: {
        FONTS: './src/assets/fonts'
        , IMAGES: './src/assets/images'
        , STYLE: './src/assets/css'
        , SCRIPT: './src/assets/js'
        , LIB: './src/assets/lib'
        , FONTS: './src/assets/fonts'
        , DOWNLOAD: './src/assets/download'
    }
},
// 산출물 경로
DEST_PATH = {
    HTML: './dist'
    , ASSETS: {
        FONTS: './dist/assets/fonts'
        , IMAGES: './dist/assets/images'
        , STYLE: './dist/assets/css'
        , SCRIPT: './dist/assets/js'
        , LIB: './dist/assets/lib'
        , FONTS: './dist/assets/fonts'
        , DOWNLOAD: './dist/assets/download'
    }
};

gulp.task( 'clean', () => {
    return new Promise( resolve => {
        del.sync(DEST_PATH.HTML);
            resolve();
        }
    );
});

gulp.task( 'scss:compile', () => {
    var options = {
        outputStyle: "nested" // nested, expanded, compact, compressed
        , indentType: "space" // space, tab
        , indentWidth: 4 //
        , precision: 8
        , sourceComments: false // 코멘트 제거 여부
    };

    return gulp.src( PATH.ASSETS.STYLE + '/**/*.scss' )
        .pipe( sourcemaps.init() )
        .pipe( scss(options) )
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest( DEST_PATH.ASSETS.STYLE ) )
        .pipe( browserSync.reload({stream: true}) );
});

gulp.task( 'html', () => {
    return gulp.src( PATH.HTML + '/*.html' )
        .pipe( gulp.dest( DEST_PATH.HTML ) )
        .pipe( browserSync.reload({stream: true}) );
});

gulp.task( 'script', () => {
    //return gulp.src( PATH.ASSETS.SCRIPT + '/**/*.js' )
    //    .pipe( gulp.dest( DEST_PATH.ASSETS.SCRIPT ) )
    //    .pipe( browserSync.reload({stream: true}) );

    return new Promise( resolve => {
        gulp.src( PATH.ASSETS.SCRIPT + '/**/*.js' )
            .pipe( gulp.dest( DEST_PATH.ASSETS.SCRIPT ) )
            .pipe( browserSync.reload({stream: true}) );

        resolve();
    });
});

gulp.task( 'library', () => {
    return gulp.src( PATH.ASSETS.LIB + '/**/*')
        .pipe( gulp.dest( DEST_PATH.ASSETS.LIB ) )
        .pipe( browserSync.reload({stream: true}) );
});

gulp.task( 'fonts', () => {
    return gulp.src( PATH.ASSETS.FONTS + '/**')
        .pipe( gulp.dest( DEST_PATH.ASSETS.FONTS ));
});

gulp.task( 'download', () => {
    return gulp.src( PATH.ASSETS.DOWNLOAD + '/**')
        .pipe( gulp.dest( DEST_PATH.ASSETS.DOWNLOAD ));
});

gulp.task( 'images', () => {
    return gulp.src( PATH.ASSETS.IMAGES + '/**/*.{png,jpeg,jpg,svg,ico,mp3,mp4}' )
        .pipe( gulp.dest( DEST_PATH.ASSETS.IMAGES ) )
        .pipe( browserSync.reload({stream: true}) );
});

gulp.task('ejs', () => {
    return gulp.src(['./src/html/**/*.ejs', '!./src/html/**/_*.ejs'], { base: './src/html' })
        .pipe(ejs({
            msg: "Hello Gulp!"
        }))
        .pipe( rename({ extname: '.html' }) )
        .pipe(htmlbeautify(
            {indentSize: 4}
        ))
        .pipe( gulp.dest(DEST_PATH.HTML) )
        .pipe( browserSync.reload({stream: true}) );
});

gulp.task( 'nodemon:start', () => {
    return new Promise( resolve => {
        nodemon({
            script: 'app.js'
             , watch: DEST_PATH.HTML
        });
        resolve();
    });
});

gulp.task('watch', () => {
    return new Promise( resolve => {
        //gulp.watch(PATH.HTML + "/**/*.html", gulp.series(['ejs']));
        gulp.watch(PATH.HTML + "/**/*.ejs", gulp.series(['ejs']));
        gulp.watch(PATH.ASSETS.SCRIPT + "/**/*.js", gulp.series(['script']));
        gulp.watch(PATH.ASSETS.STYLE + "/**/*.scss", gulp.series(['scss:compile']));
        gulp.watch(PATH.ASSETS.IMAGES + "/**/*.{png,jpeg,jpg,svg,ico,mp4,mp3}", gulp.series(['images']));
        gulp.watch(PATH.ASSETS.LIB + "/**/*.js", gulp.series(['library']));

        resolve();
    });
});

gulp.task('browserSync', () => {
    return new Promise( resolve => {
        browserSync.init( null, {
            proxy: 'http://localhost:8002'
            , port: 8003
        });

        resolve();
    });
});


var allSeries = gulp.series([
    'clean'
    , 'scss:compile'
    //, 'html'
    , 'ejs'
    , 'script'
    , 'images'
    , 'library'
    , 'fonts'
    , 'download'
    , 'nodemon:start'
    , 'browserSync'
    , 'watch'
]);

gulp.task( 'default', allSeries);