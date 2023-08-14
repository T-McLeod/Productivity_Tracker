importScripts('background/TabTracker.js', 'background/LogService.js');

let domains;
let onTask = 0;
let offTask = 0;

async function init() {
    domains = new Set(await DomainTracker.getDomainSet());
    console.log(domains);
    let onTask = 0;
    let offTask = 0;

    chrome.alarms.create('reminder', { periodInMinutes: 15 });
    createNotification();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getGlobalData') {
        sendResponse(myGlobalData);
    }
});

chrome.runtime.onSuspend.addListener(() => {
    console.log("Extension is about to be suspended (browser closing or extension disabled).");
  });

  chrome.windows.onFocusChanged.addListener(windowId => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      console.log("No focused window.");
    } else {
      console.log(`Window with ID ${windowId} is now focused.`);
    }
  });

chrome.tabs.onActivated.addListener( async (activeInfo) => {
    const time = new Date();
    const tabID = activeInfo.tabId
    let tab = await chrome.tabs.get(tabID);

    let domain = DomainTracker.urlToDomain(tab.url);
    const lastLog = await TimeLogger.getLastLog();
    if(lastLog){ //Not end solution, need to handle what happens if there is no log yet
        lastDomain = lastLog.domain;



        if(domain === lastDomain)
            return

        if(!domains.has(domain)){
            domains.add(domain);
            DomainTracker.addDomain(domains, domain);
        }

        // Get delta time
        const lastDate = new Date(lastLog.time);
        await updateTime(lastDomain, lastDate, time, false);
    } else {
        domains.add(domain);
        await DomainTracker.addDomain(domains, domain);
    }

    // Add new log
    TimeLogger.logTime("TabSwitch", domain, time);
})

async function updateTime(lastDomain, lastDate, newTime, log = true){
    deltaTime = newTime - lastDate;
    console.log("Adding " + deltaTime + "ms to " + lastDomain);

    // Update domObj
    const domObj = await DomainTracker.getDomObj(lastDomain);
    domObj.timeSpent += deltaTime;
    console.log(domObj);
    await DomainTracker.updateDomObj(domObj);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getDomains') {
        sendResponse(domainTracker);
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'reminder') {
        createNotification();
    }
});

function createNotification() {
    const time = new Date().toLocaleTimeString()
    console.log("notification sent at " + time);
    notificationId = 'onTask_' + time;
    chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: 'focus.png',
        title: 'Are you on task?',
        message: 'Since we last asked, would you say you spent your time being on task?',
        buttons: [
            { title: 'Yes, I have been on task and working.' },
            { title: 'No, I have not been on task and working' }
        ],
        requireInteraction: true,
        priority: 2
    });
}

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (notificationId.substring(0, 6) === 'onTask') {
        if (buttonIndex === 0) {
            console.log("User on task");
            onTask++;
        } else if (buttonIndex === 1) {
            console.log("User not on task");
            offTask;
        }
        chrome.notifications.clear(notificationId);
    }
});

init();