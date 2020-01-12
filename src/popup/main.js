initialize();

function render(state)
{
    console.log(state);
}

async function initialize()
{
    let matchedTabs = await browser.tabs.query(
        {
            active: true,
            currentWindow: true
        }
    );
    const tabID = matchedTabs[0].id;

    const inputSender = new MessageSender("PageInputSlot");

    document.getElementById("button-A").addEventListener(
        "click",
        () => inputSender.sendToTab(tabID, "a")
    );
    document.getElementById("button-B").addEventListener(
        "click",
        () => inputSender.sendToTab(tabID, "b")
    );
    document.getElementById("button-clear").addEventListener(
        "click",
        () => inputSender.sendToTab(tabID, "clear")
    );

    const slot = new MessageSlot("PopupStateSlot",
        function (state, sender)
        {
            if (sender.tab.id === tabID)
            {
                render(state);
            }
        }
    );
    
    new MessageSender("PageStateSlot").sendToTab(tabID);
}