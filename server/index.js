var express = require('express');
var bodyParser = require('body-parser');
var ono = require('ono');
var modes = require('./modes');
var static = require('./static');
var api = require('./api');

var app = express();

// Normal/background/silent modes
app.use(modes);

// Serve static files
app.use(static);

// Parse HTTP request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// REST API
app.use('/api', api);

// 404
app.use(function(req, res, next) {
  throw ono({ status: 404 }, req.url, 'could not be found');
});

// Error handler
app.use(function(err, req, res, next) {
  err.status = err.status || 500;
  res.status(err.status).json({
    error: err.status,
    message: err.message
  });

  if (err.status >= 500) {
    // Server error! Write the details to the console
    console.error('HTTP %d %s', err.status, err.stack);
  }
});

// Start the server on port 8080
app.listen(8080);
