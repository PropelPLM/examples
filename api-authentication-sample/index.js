var jsforce = require('jsforce');
const express = require('express');
const axios = require('axios');
const app = express()
const port = 4000

//
// OAuth2 client information can be shared with multiple connections.
//
var oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com',
  clientId : '3MVG9Kip4IKAZQEX6x6kxxN_j5UrS.Y3.jweG4Wl5enh2DlE1pUfqWBJGfYhdafclYF3AGo6x776BYSJJnnCk',
  clientSecret : '923A5A2B71709C341EDC6E8E3ABEB4C2309C9A534FBBC13ABE62F556E8E356B9',
  redirectUri : 'http://localhost:4000/oauth2/callback'
});
//
// Get authorization url and redirect to it.
//
app.get('/oauth2/auth', function(req, res) {
  res.redirect(oauth2.getAuthorizationUrl({ scope : 'api full web refresh_token offline_access' }));
});

//
// Pass received authorization code and get access token
//
app.get('/oauth2/callback', function(req, res) {
  var conn = new jsforce.Connection({ oauth2 : oauth2 });
  var code = req.param('code');
  conn.authorize(code, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
    console.log(conn);
    /*console.log(conn.accessToken);
    console.log(conn.refreshToken);
    console.log(conn.instanceUrl);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);*/

    // USING JSFORCE, fetch an item and revision data
    var itemNumber = '200-00205';
    conn.apex.get('/services/apexrest/PDLM/api/v2/item/'+itemNumber+'')
    .then( (resultRows) => {
      console.log(resultRows);
    })
    .catch((e)=>{ 
      console.log(e);
    }); 
    // USING AXIOS, fetch an item and revision data
    axios.get(conn.instanceUrl + '/services/apexrest/PDLM/api/v2/item/'+itemNumber+'', {
      headers: {'Authorization': 'Bearer ' + conn.accessToken }
    })
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })

    axios.get('https://login.salesforce.com/services/oauth2/userinfo', {
      headers: {'Authorization': 'Bearer ' + conn.accessToken }
    })
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })

    res.send('Everything is good.');

  });
});

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))