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

chrome.tabs.onActivated.addListener( async (activeInfo) => {
    const tabID = activeInfo.tabId
    let tab = await chrome.tabs.get(tabID);

    let domain = DomainTracker.urlToDomain(tab.url);

    if(!domains.has(domain)){
        domains.add(domain);
        let domainObject = new DomainObject(domain);
    }

    let domainObject = new DomainObject(domain);
    await DomainTracker.updateDomObj(domainObject);
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getDomains') {
        sendResponse(domainTracker);
    }
});