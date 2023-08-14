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
    static async addDomain(domain){
        let key = "DT_" + domain;
        return toPromise((resolve, reject) => {
            chrome.storage.local.set({[key]: new DomainObject(domain)}, (result) => {
                if(chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(result);
            })
        })
    }

    static async updateDomObj(domainObject){
        let domain = domainObject.domain;
        let key = "DT_" + domain;
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
            console.log("key: " + key);
            chrome.storage.local.get([key], (result) => {
                if(chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                console.log(DomainObject.create(result[key]));
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
        return("At " + this.domain + ": " + this.timeSpent);
    }
}