const blackList = {
    ballmer: ["steve ballmer", "steven anthony ballmer"],
    bezos: ["bezos", "jeff bezos"],
    bloomberg: ["michael bloomberg", "michael rubens bloomberg"],
    brin: ["sergey brin", "sergey mikhailovich brin"],
    buffett: ["buffett", "warren buffett", "warren edward buffett"],
    ellison: ["larry ellison", "lawrence joseph ellison"],
    gates: ["bill gates", "william henry gates iii"],
    kanye: ["kanye", "kanye west", "ye west", "kanye omari west"],
    musk: ["elon", "musk", "elon musk", "elon reeve musk"],
    page: ["larry page", "lawrence edward page"],
    trump: ["trump", "donald trump", "donald j. trump", "donald john trump"],
    zuck: ["zuck", "zuckerberg", "mark zuckerberg", "mark elliot zuckerberg"]
}

browser.storage.local.get("status")
    .then((result) => {
        let statusValue = result.status;
        if (statusValue == null || statusValue == true) {
            createObserver();
            if (isRich(document.body.textContent)) {
                findRichNode(document.body);
            }
        }
    }
    );

function findRichNode(node) {
    if (node.parentNode.hasAttribute("btr-rich-node")) {
        return;
    }
    if (node.hasChildNodes()) {
        node.childNodes.forEach(element => {
            if (node.nodeName = "A") {
                if (node.href != undefined && node.href != '') {
                    if (isRichUrl(node.href)) {
                        processNode(node);
                        return;
                    }
                }
            }
            findRichNode(element);
        })
    } else if (node.nodeType === Node.TEXT_NODE) {
        if (node.parentNode && node.parentNode.nodeName === 'TEXTAREA') {
            return;
        } else if (isRich(node.textContent)) {
            processNode(node);
        }
    } else if (node.nodeName = "IMG") {
        if (node.src != undefined && node.src != '') {
            if (isRichUrl(node.src)) {
                processNode(node);
            }
        }
        if (node.alt != undefined && node.alt != '') {
            if (isRich(node.alt)) {
                processNode(node);
            }

        }
    }
}

function isRich(element) {
    let hasMatch = false;
    Object.keys(blackList).forEach(person => {
        blackList[person].forEach(alias => {
            if (new RegExp("(^|(\\.|,|\\s|\“)+)" + alias + "((,|\\.|\\s|s|\\’s|\\?|\\'|\“)+|$)", "ig").test(element)) {
                hasMatch = true;
                return;
            }
        });
    });
    return hasMatch;
}

function isRichUrl(url) {
    let hasMatch = false;
    let urlPath = url.split("?")[0].toLowerCase();
    Object.keys(blackList).forEach(person => {
        blackList[person].forEach(alias => {
            if (urlPath.includes(alias)) {
                hasMatch = true;
                return;
            }
        });
    });
    return hasMatch;
}

function processNode(node) {
    let parentNode = node.parentNode;
    if (parentNode !== document.body) {
        addSelectorToNode(parentNode);
        addLogoToNode(parentNode);
        addBlurToNode(parentNode);
    }
}

function addLogoToNode(node) {
    let img = document.createElement('img');
    img.addEventListener("click", function (event) { handleLogoClick(this); });
    img.classList.add('btr-logo');
    img.src = browser.extension.getURL("icons/blocktherich-on-96.png");
    img.style.transition = "1s ease";
    node.insertAdjacentElement("beforebegin", img);
}

function addBlurToNode(node) {
    node.style.filter = "blur(1.5rem)";
    node.style.transition = "1s ease";
    node.addEventListener("mouseenter", function (event) { removeBlur(this); });
    node.addEventListener("mouseleave", function (event) { addBlur2(this); });
}

function addBlur2(node) {
    node.previousSibling.style.opacity = "1";
    node.style.filter = "blur(1.5rem)";
}

function removeBlur(node) {
    node.previousSibling.style.opacity = "0";
    node.style.filter = "";
}

function addSelectorToNode(node) {
    if (!node.hasAttribute("btr-rich-node")) {
        node.setAttribute("btr-rich-node", true);
    }
}

function handleLogoClick(node) {
    node.nextSibling.style.filter = "";
    node.style.display = "none";
}

function createObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const newNode = mutation.addedNodes[i];
                    findRichNode(newNode);
                }
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}