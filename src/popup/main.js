import { instantiate } from "./viewbind/index.js"

class Controller
{
    initialize(element)
    {
        this.inputSender = null;
        this.aButton.classList.add("button-A");
        this.bButton.classList.add("button-B");
        this.clearButton.classList.add("button-clear");
    }

    setTabID(tabID)
    {
        this.tabID = tabID;
        this.inputSender = new MessageSender("PageInputSlot");
    }

    onClickA()
    {
        this.inputSender.sendToTab(this.tabID, "a");
    }

    onClickB()
    {
        this.inputSender.sendToTab(this.tabID, "b");
    }

    onClickClear()
    {
        this.inputSender.sendToTab(this.tabID, "clear");
    }

    render(state)
    {
        let aLabel = "A";
        let bLabel = "B";
        this.bButton.disabled = true;

        if (state.a !== null)
        {
            aLabel = state.a;
            this.bButton.disabled = false;
        }

        if (state.b !== null)
        {
            bLabel = state.b;
        }

        this.aButton.textContent = aLabel;
        this.bButton.textContent = bLabel;
    }
}

initialize();

async function initialize()
{
    let matchedTabs = await browser.tabs.query(
        {
            active: true,
            currentWindow: true
        }
    );
    const tabID = matchedTabs[0].id;

    const controller = instantiate(document.querySelector("#main"), Controller);
    controller.setTabID(tabID);

    const slot = new MessageSlot("PopupStateSlot",
        function (state, sender)
        {
            if (sender.tab.id === tabID)
            {
                controller.render(state);
            }
        }
    );
    
    new MessageSender("PageStateSlot").sendToTab(tabID);
}