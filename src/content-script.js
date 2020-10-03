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
    looper = new ABLooper(video);
    
    let observer = new MutationObserver(onMutation);
    observer.observe(
        video,
        {
            attributes: true, childList: false, subtree: false
        }
    );
}

class VideoDetector
{
    constructor(callback)
    {
        this.video = null;
        this.onDetectVideo = callback;
        this.mutationObserver = new MutationObserver(this.onMutation.bind(this));
    }

    start()
    {
        this.mutationObserver.observe(
            document,
            { attributes: false, childList: true, subtree: true }
        );

        let video = document.querySelector("video");
        if (video !== null)
        {
            this.registerVideo(video);
        }
    }

    registerVideo(video)
    {
        this.video = video;
        this.onDetectVideo(video);
    }

    onMutation(mutations, observer)
    {
        for (let mutation of mutations)
        {
            if (mutation.type === "childList")
            {
                for (let node of mutation.addedNodes)
                {
                    if (node.tagName.toLowerCase() === "video")
                    {
                        this.registerVideo(node);
                    }
                }
            }
        }
    }
}

let detector = new VideoDetector(bindToVideo);
detector.start();
var looper;