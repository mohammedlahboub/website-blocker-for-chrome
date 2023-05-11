


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.sync.get('blockedWebsites', (data) => {

        let blockedWebsitesExt = data.blockedWebsites || [];
        let cstArr = ['twitch.tv', 'twitter.com', 'www.tiktok.com', 'reddit.com', 'pornhub.com'];
        let blockedWebsites = blockedWebsitesExt.concat(cstArr);
        // console.log(blockedWebsites); 
        let url = tab.url.toLowerCase();

        for (let i = 0; i < blockedWebsites.length; i++) {


            if (url.indexOf(blockedWebsites[i]) !== -1) {
                chrome.tabs.update(tabId, { url: "./blockedPage/blocked.html" })

            }
        }
    });
});




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getCurrentTabUrl") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            let currentTab = tabs[0];
            let currentUrl = new URL(currentTab.url);
            let currentDomainName = currentUrl.hostname;
            sendResponse({ currentDomainName: currentDomainName });
        });

        return true; // Keep the message channel open for sendResponse
    } else if (request.action === "reloadCurrentTab") {
        chrome.tabs.reload();
    }
});
