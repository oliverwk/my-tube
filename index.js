const express = require('express')
var fetch = require('node-fetch');
var bodyParser = require('body-parser')
const { URLSearchParams } = require('url');
const app = express()
const port = process.env.PORT || 5000
app.use(bodyParser.text())

app.get('/', async (req, res) => {
  console.log(req.query['hub.challenge']);
  let para = new URLSearchParams();
  if (req.query['hub.mode'] == "subscribe") {
  	para.append('Body', 'Got a subscribe request with code: '+req.query['hub.challenge']);
  } else {
	para.append('Body', 'Got another request with the body: '+req.body);
	console.log('Got another request with the body: '+req.body)
	console.log('Got another request with the body: '+JSON.stringify(req.body))
  }
  para.append('From', "+14157413728");
  para.append('To', "+31622339914");
  let response = await fetch('https://api.twilio.com/2010-04-01/Accounts/ACd0ee4eaae06ee358c0c3f4a7e0160382/Messages.json', {
    method: 'POST',
    body: para,
    headers: {
     'Authorization': 'Basic '+process.env.bs64_Twilio
     }
  });
  console.log(response.status);
  res.send(req.query['hub.challenge'])
})

app.listen(port, () => {
  console.log(`Tube app listening at http://localhost:${port}`)
})
