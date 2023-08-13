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
                console.log(result[key]);
                resolve(result[key]);
            })
        })
    }

    static urlToDomain(url){
        let arr = /(\w+\.)+\w+/.exec(url);
        if(arr)
            return arr[0];
        return null
    }
}

class DomainObject {
    constructor(domain) {
        this.domain = domain;
        this.timeSpent = 0;
    }

    toString(){
        return("At " + this.domain + ":\n    Time Spent- " + this.timeSpent);
    }
}