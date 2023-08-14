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

    static getLastLog = async() => {
        let logs = await TimeLogger.getLog();
        console.log(logs);
        return logs[logs.length - 1];
    }

    static logTime = async(event, domain, date) => {
        const log = await this.getLog();
        const time = date.toString();
        const updatedLog = [...log, {time, event, domain}];
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