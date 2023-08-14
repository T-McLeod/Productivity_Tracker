const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    });
    return promise;
}

class DomainTracker {
    static async getDomainSet(){
        const key = "DTSet";
        return toPromise((resolve, reject) => {
            console.log("Retrieving " + key);
            chrome.storage.local.get([key], (result) => {
                if(chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                if(!result[key] && Object.keys(result.key).length !== 0){
                    console.log("Retrieved Set");
                    console.log(result[key]);
                    resolve(result[key]);
                } else {
                    console.log("New domain set created");
                    resolve(new Set());
                }
            })
        })
    }

    static async addDomain(domains, domain){
        console.log("adding " + domain);
        const newDomainObj = new DomainObject(domain);
        await this.updateDomObj(newDomainObj);

        console.log("Updating domain set");
        console.log(domains);

        const key = "DTSet";
        return toPromise((resolve, reject) => {
            chrome.storage.local.set({[key]: domains}, (result) => {
                if(chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(result);
            })
        })
    }

    static async updateDomObj(domainObject){
        let domain = domainObject.domain;
        let key = "DT_" + domain;
        console.log("updating " + key);
        console.log(domainObject);
        return toPromise((resolve, reject) => {
            chrome.storage.local.set({[key]: domainObject}, (result) => {
                if(chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(result);
            })
        })
    }

    static async getDomObj(domain){
        let key = "DT_" + domain;
        return toPromise((resolve, reject) => {
            console.log("Retrieving " + key);
            chrome.storage.local.get([key], (result) => {
                if(chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                console.log(result);
                resolve(DomainObject.create(result[key]));
            })
        })
    }

    static urlToDomain(url){
        let arr = /(\w+\.)+\w+/.exec(url);
        if(arr)
            return arr[0];
        return "unknown";
    }
}

class DomainObject {
    constructor(domain) {
        this.domain = domain;
        this.timeSpent = 0;
    }

    static create(object){
        const domObj = new DomainObject(object.domain);
        domObj.timeSpent = object.timeSpent;
        return domObj
    }

    toString(){
        return("At " + this.domain + ": " + DomainObject.formatTime(this.timeSpent));
    }

    static formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
      
        if (hours >= 1) {
          return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
        } else if (minutes >= 1) {
          return `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
        } else {
          return `${seconds.toString().padStart(2, '0')}s`;
        }
    }

}