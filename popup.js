

var tabId_re = /tabId=([0-9]+)/;
var match = tabId_re.exec(window.location.hash);
if (match) {
  var hist = chrome.extension.getBackgroundPage().History[match[1]];

  chrome.storage.local.get(["facebook", "reddit", "twitter", "youtube", "pinterest"], function(result) {
    console.log(result);
    let date = new Date(0);
    console.log("facebook " + result["facebook"][0].toString());
    date.setSeconds(result["facebook"][0]);
    console.log(date.toISOString());
    document.getElementById("facebook-usage").innerText = "FaceBook Usage: " + date.toISOString().substr(11, 8);
    date = new Date(0);
    date.setSeconds(result["reddit"][0]);
    document.getElementById("reddit-usage").innerText = "Reddit Usage: " + date.toISOString().substr(11, 8);
    date = new Date(0);
    date.setSeconds(result["twitter"][0]);
    document.getElementById("twitter-usage").innerText = "Twitter Usage: " + date.toISOString().substr(11, 8);
    date = new Date(0);
    date.setSeconds(result["youtube"][0]);
    document.getElementById("youtube-usage").innerText = "Youtube Usage: " + date.toISOString().substr(11, 8);
    date = new Date(0);
    date.setSeconds(result["pinterest"][0]);
    document.getElementById("pinterest-usage").innerText = "Pinterest Usage: " + date.toISOString().substr(11, 8);

  });


}
