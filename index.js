const express = require('express');
var fetch = require('node-fetch');
var xmlparser = require('express-xml-bodyparser');
const { URLSearchParams } = require('url');
const app = express();
const port = process.env.PORT || 5000;
const xml2jsDefaults = {
    explicitArray: false,
    normalize: false,
    normalizeTags: false,
    trim: true
}
app.use(xmlparser(xml2jsDefaults));

app.all('/', async (req, res) => {
  console.log(req.query['hub.challenge'] ? "Challenge: "+req.query['hub.challenge'] : "No challenge provided");
  console.log(req.query['hub.mode'] ? "Mode: "+req.query['hub.mode'] : "No mode provided");
  console.log(req.query['hub.topic'] ? "Topic: "+req.query['hub.topic'] : "No topic provided");
  let para = new URLSearchParams();
  if (req.query['hub.mode'] == "subscribe") {
  	para.append('Body', 'Got a subscribe request with code: '+req.query['hub.challenge']+" and with the channel: https://www.youtube.com/channel/"+req.query['hub.topic'].split("channel_id=")[1]);
  } else if (req.query['hub.mode'] == "unsubscribe") {
    	para.append('Body', 'Got a unsubscribe request with code: '+req.query['hub.challenge']+" and with the topic: "+req.query['hub.topic'].split("channel_id")[1]);
  } else {
    	/*para.append('Body', 'Got another request with the body: '+JSON.stringify(req.body.feed));
    	console.log('Got another request with the body: '+JSON.stringify(req.body));*/
      try {
        let video = req.body.feed.entry
        para.append("Body", "Er is een nieuwe video van "+video.author.name+" met de titel ```'"+video.title+"'```\n"+video.link["$"].href);
        console.log("Er is een nieuwe video van "+video.author.name+" met de titel '\x1b[4m"+video.title+"\x1b[0m'\n"+video.link["$"].href);
      } catch (e) {
        console.log(e);
        para.append('Body', 'Er ging iets mis met de XML dit de body: '+JSON.stringify(req.body.feed));
      	console.log('Er ging iets mis met de XML dit de body:', JSON.stringify(req.body));
      }
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
  res.send(req.query['hub.challenge'] ? req.query['hub.challenge'] : "No challenge provided")
})

app.listen(port, () => {
  console.log(`My-Tube app listening at https://localhost:${port}`)
})
