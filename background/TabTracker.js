class DomainTracker {
    static numCreated = 0;


    constructor() {
        this.domains = new Set();
        this.prefix = "DT" + numCreated + "_";
        numCreated++;
    }

    async addDomain(domain){
        domains.add(domain);
        domainObject = new DomainObject(domain);
        
    }

    addUrl(url){
        this.addDomain(getDomain(url));
    }

    async updateDomObj(domainObject){
        key = prefix + domainObject.domain;
        //set local storage to key
    }

    static getDomain(url){
        let arr = /(\w+\.)+\w+/.exec(url);
        if(arr.length == 0)
            return null;
        else
            return arr[0];
    }
}

class DomainObject {
    constructor(domain) {
        this.domain = domain;
        this.timeSpent = 0;
    }
}

chrome.tabs.onActivated.addListener( (activeInfo) => {
    const tabID = activeInfo.tabId
    console.log(activeInfo);
    chrome.tabs.get(tabID, (tab) => {
        TimeLogger.logTime(tab.url);
    })
})