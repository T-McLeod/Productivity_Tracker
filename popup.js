var timeStamp = document.getElementById("time stamp");
timeStamp.textContent = chrome.storage.local.get(["Closed Tab"]).data;