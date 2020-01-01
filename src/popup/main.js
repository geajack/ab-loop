initialize();

const sender = new MessageSender("Page");

function initialize()
{
    document.getElementById("button-A").addEventListener("click", onClickA);
    document.getElementById("button-B").addEventListener("click", onClickB);
}

async function onClickA()
{
    sender.sendToTab(
        await getCurrentTabID(),
        "a"
    )
}

async function onClickB()
{
    sender.sendToTab(
        await getCurrentTabID(),
        "b"
    )
}

async function getCurrentTabID()
{
    let matchedTabs = await browser.tabs.query(
        {
            active: true,
            currentWindow: true
        }
    );
    return matchedTabs[0].id;
}