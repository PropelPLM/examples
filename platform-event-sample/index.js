var jsforce = require('jsforce');
const config = require('./config.js');
const express = require('express');
const app = express()
const port = 4000

var conn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com'
});
conn.login(config.username, config.password, function(err, userInfo) {
  if (err) { return console.error(err); }

  console.log("Authenticated and waiting for a message...");

  conn.streaming.topic("/event/PDLM__ChangeEvent__e").subscribe(function(message) {
    console.dir(message);
  });

  // ...
});

app.get('/', function(req, res) {
  res.send('Hello World');
});



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))