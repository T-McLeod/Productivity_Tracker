document.addEventListener('DOMContentLoaded', async () => {
    /*let myGlobalData = await chrome.runtime.sendMessage({ action: 'getGlobalData' });
    console.log(myGlobalData);
    const domainTracker = myGlobalData.domainTracker;
    console.log(domainTracker.prefix);

    domains = DomainTracker.domains;
    console.log(domains);
    
    for(domain in domains)
        console.log(domain);*/

    const tab = await chrome.tabs.query({ active: true, currentWindow: true });    
    console.log(tab[0]);
    console.log(tab[0].url);
    let domain = DomainTracker.urlToDomain(tab[0].url);
    console.log(domain);
    domObj = await DomainTracker.getDomObj(domain);
    console.log(domObj);

    const stamp = document.getElementById("timeStamp");
    stamp.textContent = domObj.toString();

    chrome.alarms.create('reminder', { when: 0 });


    //TimeLogger.clearPages();
})