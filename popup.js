document.addEventListener('DOMContentLoaded', async () => {

    const tab = await chrome.tabs.query({ active: true, currentWindow: true });    
    console.log(tab[0]);
    console.log(tab[0].url);
    let domain = DomainTracker.urlToDomain(tab[0].url);
    console.log(domain);
    domObj = await DomainTracker.getDomObj(domain);
    console.log(domObj);

    const stamp = document.getElementById("timeStamp");
    stamp.textContent = domObj.toString();

    //TimeLogger.clearPages();
})