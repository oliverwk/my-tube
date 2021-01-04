const express = require('express');
var fetch = require('node-fetch');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const { URLSearchParams } = require('url');
const app = express();
const port = process.env.PORT;
app.use(bodyParser.xml({
  limit: '1MB',   // Reject payload bigger than 1 MB
  xmlParseOptions: {
    normalize: true,     // Trim whitespace inside text nodes
    normalizeTags: true, // Transform tags to lowercase
    explicitArray: false // Only put nodes in array if >1
  }
}));

app.all('/', async (req, res) => {
  console.log(req.query['hub.challenge']);
  let para = new URLSearchParams();
  if (req.query['hub.mode'] == "subscribe") {
  	para.append('Body', 'Got a subscribe request with code: '+req.query['hub.challenge']+" and with the channel: https://www.youtube.com/channel/"+req.query['hub.topic'].split("channel_id")[1]);
  } else if (req.query['hub.mode'] == "unsubscribe") {
    	para.append('Body', 'Got a unsubscribe request with code: '+req.query['hub.challenge']+" and with the topic: "+req.query['hub.topic'].split("channel_id")[1]);
  } else {
    	para.append('Body', 'Got another request with the body: '+JSON.stringify(req.body));
    	console.log('Got another request with the body: '+JSON.stringify(req.body)+"\n\n");
      /*console.log("Er is een nieuwe video van: "+video.author.name+" met de titel "+video.title+" en de link "+video.link.attr["@_href"]+".");
      para.append("Er is een nieuwe video van: "+video.author.name+" met de titel "+video.title+" en de link "+video.link.attr["@_href"]+".");*/
    }
  para.append('From', "whatsapp:+14155238886");
  para.append('To', "whatsapp:+31622339914");
  let response = await fetch('https://api.twilio.com/2010-04-01/Accounts/AC560f51cedc776774bd44d9c9688fbc43/Messages.json', {
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
