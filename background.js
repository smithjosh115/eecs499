
var History = {};

chrome.storage.local.get(["facebook", "reddit", "twitter", "youtube", "pinterest", "currentDay"], function(result){
  console.log(result);
  if(typeof(result["facebook"]) === "undefined"){
    console.log(" faceboook doesnt exitst");
    chrome.storage.local.set({"facebook": [0]});
  }
  if(typeof(result["reddit"]) === "undefined"){
    console.log(" reddit doesnt exitst");
    chrome.storage.local.set({"reddit": [0]});
  }
  if(typeof(result["twitter"]) === "undefined"){
    console.log(" twitter doesnt exitst");
    chrome.storage.local.set({"twitter": [0]});
  }
  if(typeof(result["youtube"]) === "undefined"){
    console.log(" youtube doesnt exitst");
    chrome.storage.local.set({"youtube": [0]});
  }
  if(typeof(result["pinterest"]) === "undefined"){
    console.log(" pinterest doesnt exitst");
    chrome.storage.local.set({"pinterest": [0]});
  }
  if(typeof(result["currentDay"]) === "undefined"){
    console.log(" currentday doesnt exitst");
    chrome.storage.local.set({"currentDay": ""});
  }
});

chrome.storage.local.set({"daylist": ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"]});

// var Site = {};
// Site["facebook"] = [0];
// Site["reddit"] = [0];
// Site["twitter"] = [0];
// Site["youtube"] = [0];
// Site["pinterest"] = [0];
// var currentDay = "";
var daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];

chrome.browserAction.setBadgeText({ 'text': '?'});
chrome.browserAction.setBadgeBackgroundColor({ 'color': "#777" });

function Update(t, tabId, url) {
  if (!url) {
    return;
  }
  if (tabId in History) {
    if (url == History[tabId][0][1]) {
      return;
    }
  } else {
    History[tabId] = [];

  }
  History[tabId].unshift([t, url]);
  History[tabId].push(0);

  var history_limit = parseInt(localStorage["history_size"]);
  if (! history_limit) {
    history_limit = 23;
  }
  while (History[tabId].length > history_limit) {
    History[tabId].pop();
  }

  chrome.browserAction.setBadgeText({ 'tabId': tabId, 'text': '0:00'});
  chrome.browserAction.setPopup({ 'tabId': tabId, 'popup': "popup.html#tabId=" + tabId});
}

function HandleUpdate(tabId, changeInfo, tab) {
  Update(new Date(), tabId, changeInfo.url);
}

function HandleRemove(tabId, removeInfo) {
  delete History[tabId];
}

function HandleReplace(addedTabId, removedTabId) {
  var t = new Date();
  delete History[removedTabId];
  chrome.tabs.get(addedTabId, function(tab) {
    Update(t, addedTabId, tab.url);
  });
}


function UpdateBadges() {
  chrome.storage.local.get(["currentDay"], function(result){
    let whatDay = new Date();
    let day = whatDay.getDay();

    console.log(result["currentDay"]);
    
    if(result["currentDay"] === ""){
      console.log("set current day");
      chrome.storage.local.set({"currentDay": daylist[day]});
      // currentDay = daylist[day];
    }
    if(result["currentDay"] !== "" && result["currentDay"] !== daylist[day]){
      console.log("here")
      // for(let key in Site){
      //   Site[key][0] = 0;
      // // }
      chrome.storage.local.set({"facebook": [0]});
      chrome.storage.local.set({"reddit": [0]});
      chrome.storage.local.set({"twitter": [0]});
      chrome.storage.local.set({"youtube": [0]});
      chrome.storage.local.set({"pinterest": [0]});
      chrome.storage.local.set({"currentDay": daylist[day]});
      // currentDay = daylist[day];
    }
  });


  var now = new Date();
  for (tabId in History) {
    var description = FormatDuration(now - History[tabId][0][0]);
    let splitTime = description.split(":");
    let alertFrequency = 1;
    let convertMin = parseInt(splitTime[0]);
    let convertSec = parseInt(splitTime[1]);

    if(History[tabId][0][1].includes("facebook")){
      chrome.storage.local.get(["facebook"], function(result){
        let updateVal = result["facebook"][0] + 1;
        chrome.storage.local.set({"facebook": [updateVal]});
      });
      createAlert(convertMin, convertSec, alertFrequency, "facebook");
      // console.log("On facebook");
    }
    else if(History[tabId][0][1].includes("reddit")){
      chrome.storage.local.get(["reddit"], function(result){
        let updateVal = result["reddit"][0] + 1;
        chrome.storage.local.set({"reddit": [updateVal]});
      });
     
      createAlert(convertMin, convertSec, alertFrequency, "reddit");
      // console.log("On reddit");
    }
    else if(History[tabId][0][1].includes("youtube")){
      chrome.storage.local.get(["youtube"], function(result){
        let updateVal = result["youtube"][0] + 1;
        chrome.storage.local.set({"youtube": [updateVal]});
      });
    
      createAlert(convertMin, convertSec, alertFrequency, "youtube");
      // console.log("on youtube");
    }
    else if(History[tabId][0][1].includes("twitter")){
      chrome.storage.local.get(["twitter"], function(result){
        let updateVal = result["twitter"][0] + 1;
        chrome.storage.local.set({"twitter": [updateVal]});
      });
      
      createAlert(convertMin, convertSec, alertFrequency, "twitter");
      // console.log("on youtube");
    }
    else if(History[tabId][0][1].includes("pinterest")){
      chrome.storage.local.get(["pinterest"], function(result){
        let updateVal = result["pinterest"][0] + 1;
        chrome.storage.local.set({"pinterest": [updateVal]});
      });
      createAlert(convertMin, convertSec, alertFrequency, "pinterest");
      // console.log("on pinterest");
    }

    chrome.browserAction.setBadgeText({ 'tabId': parseInt(tabId), 'text': description});
  }
}

function createAlert(minutesAmount, secondsAmount, frequency, socalMediaName){
  console.log(minutesAmount);
  console.log(secondsAmount);
  console.log(minutesAmount % frequency);
  if(minutesAmount !== 0 && (minutesAmount % frequency === 0) && secondsAmount === 0){
      alert("You've spent " + minutesAmount.toString() + " minutes on " + socalMediaName);
  }
}

setInterval(UpdateBadges, 1000);


chrome.tabs.onUpdated.addListener(HandleUpdate);
chrome.tabs.onRemoved.addListener(HandleRemove);
chrome.tabs.onReplaced.addListener(HandleReplace);
