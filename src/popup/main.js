import { instantiate } from "./viewbind/index.js"

class Controller
{
    initialize(element)
    {
        this.inputSender = null;
        this.aButton.element.classList.add("button-A");
        this.bButton.element.classList.add("button-B");
        this.clearButton.classList.add("button-clear");
    }

    setTabID(tabID)
    {
        this.tabID = tabID;
        this.inputSender = new MessageSender("PageInputSlot");
    }

    onClickA()
    {
        this.inputSender.sendToTab(this.tabID, { command: "set-a" });
    }

    onClickB()
    {
        this.inputSender.sendToTab(this.tabID, { command: "set-b" });
    }

    onClickClear()
    {
        this.inputSender.sendToTab(this.tabID, { command: "clear" });
    }

    onAdjustStartLeft()
    {
        this.inputSender.sendToTab(this.tabID, { command: "adjust", endpoint: "a", direction: -1 });
    }

    onAdjustStartRight()
    {
        this.inputSender.sendToTab(this.tabID, { command: "adjust", endpoint: "a", direction: 1 });
    }

    onAdjustEndLeft()
    {
        this.inputSender.sendToTab(this.tabID, { command: "adjust", endpoint: "b", direction: -1 });
    }

    onAdjustEndRight()
    {
        this.inputSender.sendToTab(this.tabID, { command: "adjust", endpoint: "b", direction: 1 });
    }

    render(state)
    {
        if (state.a !== null)
        {
            this.aButton.setTime(state.a);
            this.bButton.enable();
        }
        else
        {
            this.aButton.clearTime();
            this.bButton.disable();
        }

        if (state.b !== null)
        {
            this.bButton.setTime(state.b);
        }
        else
        {
            this.bButton.clearTime();
        }
    }
}

class LoopButton
{
    initialize(element)
    {
        this.element = element;
        this.time.classList.add("time");
    }

    enable()
    {
        this.element.disabled = false;
    }

    disable()
    {
        this.element.disabled = true;
    }

    setTime(time)
    {
        let remainder = time;
        let hours = Math.floor(remainder / 3600);
        remainder = time - hours * 3600;
        let minutes = Math.floor(remainder / 60);
        remainder = time - minutes * 60;
        let seconds = remainder;

        let secondsTruncated = seconds.toFixed(2);

        this.time.textContent = `${hours}:${minutes}:${secondsTruncated}`;
    }

    clearTime()
    {
        this.time.textContent = "";
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

    const controller = instantiate(document.querySelector("#main"), Controller, LoopButton);
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