chrome.tabs.onActivated.addListener( (activeInfo) => {
    const tabID = activeInfo.tabId
    console.log(activeInfo);
    chrome.tabs.get(tabID, (tab) => {
        TimeLogger.logTime(tab.url);
    })
    /*chrome.tabs.query({active: true, highlighted: true}, (result) => {
        console.log(tabID);
        TimeLogger.logTime(tabID);
    });*/
})