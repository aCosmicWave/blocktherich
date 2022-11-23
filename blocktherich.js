const richAlias = ["kardashian", "michael bloomberg", "michael rubens bloomberg", "steve ballmer", "steven anthony ballmer", "sergey brin", "sergey mikhailovich brin", "buffett", "warren buffett", "warren edward buffett", "larry page", "lawrence edward page", "donald trump", "donald j. trump", "donald john trump", "trump", "elon musk", "musk", "elon reeve musk", "kanye west", "kanye", "ye west", "kanye omari west", "mark zuckerburg", "mark elliot zuckerberg", "zuck", "jeff bezos", "bezos", "larry ellison", "lawrence joseph ellison", "bill gates", "william henry gates iii"];

createObserver();

if (isRich(document.body.textContent)) {
    findRichNode(document.body);
}

function findRichNode(node) {
    if (node.hasChildNodes()) {
        node.childNodes.forEach(element => {
            if (node.nodeName = "A") {
                if (node.href != undefined && node.href != '') {
                    if (isRichUrl(node.href)) {
                        blurNode(node);
                        return;
                    }
                }
            }
            findRichNode(element)
        })
    } else if (node.nodeType === Node.TEXT_NODE) {
        if (node.parentNode && node.parentNode.nodeName === 'TEXTAREA') {
            return;
        } else if (isRich(node.textContent)) {
            blurNode(node.parentNode);
        }
    } else if (node.nodeName = "IMG") {
        if (node.src != undefined && node.src != '') {
            if (isRichUrl(node.src)) {
                blurNode(node);
            }
        }
        if (node.alt != undefined && node.alt != '') {
            if (isRich(node.alt)) {
                blurNode(node);
            }

        }
    }
}

function isRich(element) {
    let hasMatch = false;
    richAlias.forEach(alias => {
        if (new RegExp("(^|(\\.|,|\\s)+)" + alias + "((,|\\.|\\s|s|\\’s|\\?|\\')+|$)", "ig").test(element)) {
            hasMatch = true;
            return;
        }
    });
    return hasMatch;
}

function isRichUrl(url) {
    let hasMatch = false;
    let urlPath = url.split("?")[0].toLowerCase();
    richAlias.forEach(alias => {
        if (urlPath.includes(alias)) {
            hasMatch = true;
            return;
        }
    });
    return hasMatch;
}

function blurNode(node) {
    node.style.filter = "blur(1.5rem)";
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