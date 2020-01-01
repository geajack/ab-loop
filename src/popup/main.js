initialize();

const sender = new MessageSender("Page");

function initialize()
{
    document.getElementById("button-A").addEventListener("click", onClickA);
    document.getElementById("button-B").addEventListener("click", onClickB);
}

async function onClickA()
{
    sendToCurrentTab("a");
}

async function onClickB()
{
    sendToCurrentTab("b");
}

async function sendToCurrentTab(message)
{
    let matchedTabs = await browser.tabs.query(
        {
            active: true,
            currentWindow: true
        }
    );
    let tabID = matchedTabs[0].id;

    sender.sendToTab(tabID, message);
}