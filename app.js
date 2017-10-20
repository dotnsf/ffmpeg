//.  app.js

//. Ref: https://qiita.com/nasbi_suganuma/items/222cd894e09b7c5e9652

var express = require( 'express' ),
    basicAuth = require( 'basic-auth-connect' ),
    cfenv = require( 'cfenv' ),
    multer = require( 'multer' ),
    bodyParser = require( 'body-parser' ),
    fs = require( 'fs' ),
    easyimg = require( 'easyimage' ),
    ejs = require( 'ejs' ),
    ffmpeg = require( 'fluent-ffmpeg' ),
    path = require( 'path' ),
    app = express();
var appEnv = cfenv.getAppEnv();

app.use( multer( { dest: './tmp/' } ).single( 'data' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( express.static( __dirname + '/public' ) );

app.post( '/upload', function( req, res ){
  var filepath = req.file.path;
  var filetype = req.file.mimetype;
  var originalname = req.file.originalname;

  var command = ffmpeg( filepath );

  command.on( 'end', () => {
    fs.unlink( filepath, function(e){} );
    res.write( JSON.stringify( {status:true}, 2, null ) );
    res.end();
  }).screenshots({
    count: 4,
    folder: path.join( __dirname, 'tmp' ),
    filename: 'thumb-%i:%s.png',
    size: '320x?'
  });
});

var port = appEnv.port || 3000;
app.listen( port );
console.log( "server starting on " + port + " ..." );



