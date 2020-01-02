initialize();

const sender = new MessageSender("Page");

const slot = new MessageSlot("Background", onMessage)

function initialize()
{
    document.getElementById("button-A").addEventListener("click", onClickA);
    document.getElementById("button-B").addEventListener("click", onClickB);
    document.getElementById("button-clear").addEventListener("click", onClickClear);
}

function onMessage(message)
{
    switch (message)
    {
        case "set-a":
            document.getElementById("button-B").disabled = false;
        break;

        case "set-b":
        break;

        case "clear":
            document.getElementById("button-B").disabled = true;
        break;
    }
}

function onClickA()
{
    sendToCurrentTab("a");
}

function onClickB()
{
    sendToCurrentTab("b");
}

function onClickClear()
{
    sendToCurrentTab("clear");
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