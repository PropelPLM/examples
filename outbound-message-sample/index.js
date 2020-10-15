const express = require('express')
const app = express()
var xml = require('xml');
var xmlparser = require('express-xml-bodyparser');
app.use(xmlparser());

const bodyParser = require('body-parser');

app.get('/', (req, res) => {

  res.send("Hello World!");
})

// Open an endpoint
app.post('/receive-obm', (req, res) => {
  console.log(req.body);
  console.log(req.headers);

  res.set('Content-Type', 'text/xml');
  console.log(xml('<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound">true</soapenv:Envelope>'));
  res.send(xml('<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound">true</soapenv:Envelope>'));
})

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}


app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));