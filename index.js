const express = require('express');
var fetch = require('node-fetch');
var bodyParser = require('body-parser');
const { URLSearchParams } = require('url');
const app = express();
const port = process.env.PORT;
app.use(bodyParser.text({type:"*/*"}));
const options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName : "#text",
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : true,
    trimValues: true,
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
};

app.all('/', async (req, res) => {
  console.log(req.query['hub.challenge']);
  let para = new URLSearchParams();
  if (req.query['hub.mode'] == "subscribe") {
  	para.append('Body', 'Got a subscribe request with code: '+req.query['hub.challenge']+" and with the channel: https://www.youtube.com/channel/"+req.query['hub.topic'].split("channel_id")[1]);
  } else if (req.query['hub.mode'] == "unsubscribe") {
    	para.append('Body', 'Got a unsubscribe request with code: '+req.query['hub.challenge']+" and with the topic: "+req.query['hub.topic'].split("channel_id")[1]);
  } else {
    //	para.append('Body', 'Got another request with the body: '+JSON.stringify(req.body));
    	console.log('Got another request with the body: '+JSON.stringify(req.body))
       if( parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
         var tObj = parser.getTraversalObj(xmlData,options);
         var jsonObj = parser.convertToJson(tObj,options);
         let video = jsonObj.feed.entry
         para.append("Er is een nieuwe video van: "+video.author.name+" met de titel "+video.title+" en de link "+video.link.attr["@_href"]+".");

       } else {
         para.append('Body', 'Er ging iets mis met de xmldata dit is het request met de body: '+JSON.stringify(req.body));
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
  res.send(req.query['hub.challenge'])
})

app.listen(port, () => {
  console.log(`Tube app listening at http://localhost:${port}`)
})
