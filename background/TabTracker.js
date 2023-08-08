class DomainTracker {
    constructor() {
        this.domains = new Set();
    }

    addDomain(domain){
        domains.add(domain);
    }

    static getDomain(url){
        domain = "";
        while(i < url.length && url.charAt(i) != '/'){
            domain += url.charAt(i);
        }
        return domain;
    }
}

class DomainObject {
    constructor(url) {
        this.url = url;
        this.timeSpent
    }
}

chrome.tabs.onActivated.addListener( (activeInfo) => {
    const tabID = activeInfo.tabId
    console.log(activeInfo);
    chrome.tabs.get(tabID, (tab) => {
        TimeLogger.logTime(tab.url);
    })
})