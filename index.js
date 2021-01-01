const express = require('express')
var fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const app = express()
const port = process.env.PORT || 5000

app.get('/', async (req, res) => {
  console.log(req.query['hub.challenge']);
  let para = new URLSearchParams();
  para.append('Body', 'hello from nodejs-fetch with code: '+req.query['hub.challenge']);
  para.append('From', "+14157413728");
  para.append('To', "+31622339914");
  let response = await fetch('https://api.twilio.com/2010-04-01/Accounts/ACd0ee4eaae06ee358c0c3f4a7e0160382/Messages.json', {
    method: 'POST',
    body: para,
    headers: {
     'Authorization': 'Basic QUNkMGVlNGVhYWUwNmVlMzU4YzBjM2Y0YTdlMDE2MDM4MjoxMTYwZmE5ODE4M2VmZDM4YTA3YjUxYTg1NTIyN2UxZA=='
     }
  });
  console.log(response.status);
  res.send(req.query['hub.challenge'])
})

app.listen(port, () => {
  console.log(`Tube app listening at http://localhost:${port}`)
})
