function handleClick() {
    checkExtensionStatus();
}

function checkExtensionStatus() {
    (async () => {
        const isEnabled = await isExtensionEnabled();
        if (isEnabled) {
            saveStatus(false);
            browser.browserAction.setIcon({ path: "icons/blocktherich-off-96.png" });
            browser.tabs.reload();
        } else {
            saveStatus(true);
            browser.browserAction.setIcon({ path: "icons/blocktherich-on-96.png" });
            browser.tabs.reload();
        }
    })();
}

async function isExtensionEnabled() {
    let result = await browser.storage.local.get("status");
    return result.status;
}

function saveStatus(value) {
    browser.storage.local.set({ "status": value });
}

browser.runtime.onInstalled.addListener(() => { saveStatus(true); });

browser.runtime.onStartup.addListener(() => { saveStatus(true); });

browser.browserAction.onClicked.addListener(handleClick);
