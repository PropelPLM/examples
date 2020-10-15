const express = require('express');
var jsforce = require('jsforce');
const config = require('./config.js');
const app = express()
const port = 4000
const namespace = config.namespace || 'PDLM'

var conn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com'
});
conn.login(config.username, config.password, function(err, userInfo) {
  if (err) { return console.error(err); }

  console.log("Authenticated and waiting for a message...");

  conn.streaming.topic(`/event/${withNamespace('Change_Event__e')}`).subscribe(function(message) {
    var response = message.payload;
  
    var requestURLParams = '?affectedItems=true&bom=true&amls=true&attachments=false';
    
    // check to see if change event is triggered by a release
    if(response[withNamespace('Is_Approved__c')]) {

      conn.apex.get(`/services/apexrest/${config.namespace}/api/v3/change/${response[withNamespace('Record_Id__c')]}${requestURLParams}`)
      .then( (resultRows) => {
        console.log(resultRows);
      })
      .catch((e)=>{ 
        console.log(e);
      }); 
  
    }  
  });

});

var withNamespace = function(field) {
  return namespace + '__' + field;
};

app.get('/', function(req, res) {

  res.send('Hello World')

});



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))