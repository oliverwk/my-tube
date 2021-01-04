var parser = require('fast-xml-parser');
let xmlData = `<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom">
  <link rel="hub" href="https://pubsubhubbub.appspot.com"/>
  <link rel="self" href="https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCXuqSBlHAE6Xw-yeJA0Tunw"/>
  <title>YouTube video feed</title>
  <updated>2021-01-03T18:00:51.959116479+00:00</updated>
  <entry>
        <id>yt:video:73E9Nb8mdjk</id>
        <yt:videoId>73E9Nb8mdjk</yt:videoId>
        <yt:channelId>UCXuqSBlHAE6Xw-yeJA0Tunw</yt:channelId>
        <title>Don’t build a Hackintosh</title>
        <link rel="alternate" href="https://www.youtube.com/watch?v=73E9Nb8mdjk"/>
        <author>
         <name>Linus Tech Tips</name>
         <uri>https://www.youtube.com/channel/UCXuqSBlHAE6Xw-yeJA0Tunw</uri>
        </author>
        <published>2021-01-03T18:00:17+00:00</published>
        <updated>2021-01-03T18:00:51.959116479+00:00</updated>
 </entry></feed>`
var options = {
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

if( parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
    var jsonObj = parser.parse(xmlData,options);
}

// Intermediate obj
var tObj = parser.getTraversalObj(xmlData,options);
var jsonObj = parser.convertToJson(tObj,options);
console.log(jsonObj);
let video = jsonObj.feed.entry
console.log(video.link);
console.log("Er is een nieuwe video van: "+video.author.name+" met de titel "+video.title+" en de link "+video.link.attr["@_href"]+".");
