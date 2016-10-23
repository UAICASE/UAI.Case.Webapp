var express = require('express');

// Start Server
var app = express();
//


// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var port = appEnv.PORT || 3000 ;

// Public path configuration
app.use(express.static(__dirname + '/app'));
// parse application/x-www-form-urlencoded

// Start App

app.listen(port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
