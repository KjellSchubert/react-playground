var express = require('express');

var app = express();
app.use('/', express.static('src/public'));
app.use('/', express.static('build')); // browserify output

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
