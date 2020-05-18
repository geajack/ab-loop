const stateSender = new MessageSender("PopupStateSlot");

const pageInputSlot = new MessageSlot(
    "PageInputSlot",
    onPopupCommand
);

const pageStateSlot = new MessageSlot(
    "PageStateSlot",
    function()
    {
        stateSender.sendToRuntime(looper.getState());
    }
)

function onPopupCommand(message)
{
    switch (message.command)
    {
        case "set-a":
            looper.placeA();
        break;

        case "set-b":
            looper.placeB();
        break;

        case "clear":
            looper.clear();
        break;

        case "adjust":
            let delta = message.direction * 0.1;
            if (message.endpoint === "a")
            {
                looper.adjustA(delta);
            }
            else if (message.endpoint === "b")
            {
                looper.adjustB(delta);
            }
        break;
    }
    stateSender.sendToRuntime(looper.getState());
}

function onMutation(mutations)
{
    for (let mutation of mutations)
    {
        if (mutation.attributeName === "src")
        {
            looper.clear();
            looper = new ABLooper(video);
            stateSender.sendToRuntime(looper.getState());
        }
    }
}

function bindToVideo(video)
{
    let looper = new ABLooper(video);
    
    let observer = new MutationObserver(onMutation);
    observer.observe(
        video,
        {
            attributes: true, childList: false, subtree: false
        }
    );

    return looper;
}

let looper;
let video = document.querySelector("video");
if (video !== null)
{
    looper = bindToVideo(video);
}