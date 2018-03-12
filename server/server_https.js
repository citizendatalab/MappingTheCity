var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cronSetup = require('./middlewares/cronJobs.js')

var fs = require('fs');
var http = require('http');
var https = require('https');

var privateKey  = fs.readFileSync('./sslcert/certificate.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/certificate.crt', 'utf8');
var cacert = fs.readFileSync('./sslcert/cabundle.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate, ca: cacert};
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

//cronSetup.removeExpiredStartedTasks();
//cronSetup.removeExpiredCompletedTasks();

app.use(function(req, res, next) {
  // CORS headers
  // restrict it to the required domain
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
app.all('/api/v1/*', [require('./middlewares/validateRequest')]);

app.use('/', require('./routes'));

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Start the server
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
//app.set('port', process.env.PORT || 3000);

//var server = app.listen(app.get('port'), function() {
  //console.log('Express server listening on port ' + server.address().port);
//});
