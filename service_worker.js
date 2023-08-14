importScripts('background/TabTracker.js', 'background/LogService.js');

/*const myGlobalData = {
    domainTracker: new DomainTracker()
};*/

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getGlobalData') {
        sendResponse(myGlobalData);
    }
});

const domains = new Set();
let onTask = 0;
let offTask = 0;

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
            DomainTracker.addDomain(domain);
        }

        // Get delta time
        const lastDate = new Date(lastLog.time);
        console.log(lastDate);
        deltaTime = time - lastDate;
        console.log("Time: " + deltaTime);

        // Update domObj
        const domObj = await DomainTracker.getDomObj(lastDomain);
        console.log(domObj);
        domObj.timeSpent += deltaTime;
        DomainTracker.updateDomObj(domObj);


    } else {
        domains.add(domain);
        DomainTracker.addDomain(domain);
    }

    // Add new log
    TimeLogger.logTime("TabSwitch", domain, time);
})

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


chrome.alarms.create('reminder', { periodInMinutes: 15 });
let notificationNum = 0;
createNotification();

function createNotification() {
    console.log("notification sent!");
    notificationId = 'onTask' + notificationNum;
    notificationNum++;
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