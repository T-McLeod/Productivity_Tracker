const key = "TimeLog";

class TimeLogger {

    static getLog = async() => {
        return toPromise((resolve, reject) => {
            chrome.storage.local.get([key], (result) => {
                if(chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                const researches = result.TimeLog ?? [];
                resolve(researches);
            })
        })
    }

    static logTime = async(event) => {
        const log = await this.getLog();
        const time = new Date().toLocaleTimeString();
        const updatedLog = [...log, {time, event}];
        console.log(updatedLog);

        return toPromise((resolve, reject) => {
            chrome.storage.local.set({ [key]: updatedLog}, (result) => {
                if(chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(updatedLog);
            })
        })
    }

    static clearPages = () => {
        return toPromise((resolve, reject) => {
            chrome.storage.local.remove([key], () => {
                if(chrome.runtime.lastError)
                    reject(chrom.runtime.lastError)
                resolve()
            })
        })
    }
}

TimeLogger.clearPages();