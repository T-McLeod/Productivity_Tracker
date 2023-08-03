class Node {
    constructor(data){
        this.data = data;
        this.next = null;
    }
}

const node = new Node(new Date())
chrome.storage.local.set({"Closed Tab": node })

chrome.tabs.onCreated.addListener(function () {
    console.log("Hello");
    const oldNode = chrome.storage.local.get(["Closed Tab"]);
    const node = new Node(new Date());
    node.next = oldNode;
    chrome.storage.local.set({"Close Tab": node });
  });