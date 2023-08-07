document.addEventListener('DOMContentLoaded', async () => {
    var log;

    log = await TimeLogger.getLog();

    const stamp = document.getElementById("timeStamp");

    if(log.length > 0)
        stamp.textContent = log[log.length-1].time + ": " + log[log.length-1].event;
    else
        stamp.textContent = "none";

    console.log(log);

    //TimeLogger.clearPages();
})