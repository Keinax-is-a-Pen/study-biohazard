const gulp = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
      sass = require('gulp-sass'), //sassの圧縮
      header = require('gulp-header'),
      plumber = require('gulp-plumber'),
      replace = require('gulp-replace'),
      notify = require('gulp-notify');
      postcss = require('gulp-postcss');//sass拡張
      mqpacker = require('css-mqpacker');//メディアクエリをまとめる

// config.jsからscssタスクをconfigListとして読み込む

const configSass = require('../config.js').sass;
sass.compiler = require('node-sass');

Object.keys(configSass).forEach((key) => {
  gulp.task('sass', function() {
    // scss_commonをconfigとして変数化
    const config = configSass[key];
    return gulp.src(configSass.src)

    .pipe(plumber({//plumberプラグインの実行
      errorHandler: function(err) {//errorHandlerに渡した処理は、エラーを受け取った際に実行します
        notify.onError("<%= error.message %>");
        console.log(err.messageFormatted);
        this.emit('end');//emit イベントを発火してデータを渡す 処理が終わったらendイベントを発火します.
      }
    }))
    .pipe(sass({outputStyle: 'expanded'}))//出力形式の種類　#nested, compact, compressed, expanded.
    .pipe(postcss([mqpacker()]))//mediaqueryまとめ
    .pipe(autoprefixer({
           browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
           cascade: false
       }))//ベンダーの付与　browsersのオプションでサポートしたいブラウザを指定。今回はメインブラウザの最新2バージョン、iOS 8.1以上、Android Browser 4.4以上

    .pipe(replace(/@charset "UTF-8";/g, ''))//@charset "UTF-8";自動生成された場合、@charset "UTF-8";の削除
    .pipe(header('@charset "UTF-8";\n\n'))//@charset "UTF-8";を追加
    // コンパイルしたファイルを指定のディレクトリに出力する

    // config.dest === dir.preview
    .pipe(gulp.dest(configSass.dest));
  });
});