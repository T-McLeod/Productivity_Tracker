class DomainTracker {
    constructor() {
        this.domains = new Set();
    }

    addDomain(domain){
        domains.add(domain);
        
    }
}

chrome.tabs.onActivated.addListener( (activeInfo) => {
    const tabID = activeInfo.tabId
    console.log(activeInfo);
    chrome.tabs.get(tabID, (tab) => {
        TimeLogger.logTime(tab.url);
    })
})