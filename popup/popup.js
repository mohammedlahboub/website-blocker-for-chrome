let form = document.getElementById("block-form");
let input = document.getElementById("url-input");
let list = document.getElementById("blocked-list");

//! Load blocked websites from storage and display them in the list
chrome.storage.sync.get("blockedWebsites", (data) => {
    let blockedWebsites = data.blockedWebsites || [];

    for (let i = 0; i < blockedWebsites.length; i++) {
        let item = document.createElement("li");
        item.textContent = blockedWebsites[i];
        list.appendChild(item);


        item.addEventListener("click", () => {
            let index = blockedWebsites.indexOf(item.textContent);
            blockedWebsites.splice(index, 1);

            chrome.storage.sync.set({ blockedWebsites: blockedWebsites }, () => {
                list.removeChild(item);
            });

        });
    }
});

//! Handle form submission
form.addEventListener("submit", (event) => {
    event.preventDefault();

    let url = input.value.trim().toLowerCase();

    if (url.length === 0) {
        return;
    }

    chrome.storage.sync.get("blockedWebsites", (data) => {
        let blockedWebsites = data.blockedWebsites || [];

        if (blockedWebsites.indexOf(url) === -1) {
            blockedWebsites.push(url);

            chrome.storage.sync.set({ blockedWebsites: blockedWebsites }, () => {
                let item = document.createElement("li");
                item.textContent = url;
                list.appendChild(item);
                input.value = "";

            });
        }
    });
});



document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "getCurrentTabUrl" }, (response) => {
        let currentDomainName = response.currentDomainName;
        let urlContainer = document.getElementById("url-container");
        console.log(currentDomainName);

        if (currentDomainName) {
            urlContainer.textContent = currentDomainName;
        } else {
            urlContainer.textContent = "Unable to retrieve Website URL";
        }
    });
});


//! Block current URL BTN
const blockCurentUrl = document.getElementById("url-block-btn");
blockCurentUrl.addEventListener("click", () => {
    const url = document.getElementById("url-container").textContent;
    if (url.length === 0) {
        return;
    }

    chrome.storage.sync.get("blockedWebsites", (data) => {
        let blockedWebsites = data.blockedWebsites || [];

        if (blockedWebsites.indexOf(url) === -1) {
            blockedWebsites.push(url);

            chrome.storage.sync.set({ blockedWebsites: blockedWebsites }, () => {
                let item = document.createElement("li");
                item.textContent = url;
                list.appendChild(item);
                input.value = "";
            });

        }
    });
    chrome.runtime.sendMessage({ action: "reloadCurrentTab" });
});

const showBlockedUrls = document.querySelector(".blocked-show");
const blockedUrls = document.getElementById("blocked-list-Container");


showBlockedUrls.addEventListener("click", () => {
    blockedUrls.classList.toggle("hidden");
});