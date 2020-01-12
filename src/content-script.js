class ABLooper
{
    constructor(videoElement)
    {
        this.videoElement = videoElement;
        this.a = null;
        this.b = null;
        this.looping = false;
        this.justLooped = false;

        this.videoElement.addEventListener("timeupdate", this.onTick.bind(this));
        this.videoElement.addEventListener("seeking", this.onSeek.bind(this));
    }

    placeA()
    {
        this.a = this.videoElement.currentTime;
    }

    placeB()
    {
        this.b = this.videoElement.currentTime;
        this.looping = true;
    }

    adjustA(delta)
    {
        if (this.a !== null)
        {
            this.a += delta;
        }

        if (this.b !== null && this.a > this.b)
        {
            this.a = this.b;
        }
    }

    adjustB(delta)
    {
        if (this.b !== null)
        {
            this.b += delta;
        }

        if (this.a !== null && this.b < this.a)
        {
            this.b = this.a;
        }
    }

    clear()
    {
        this.a = null;
        this.b = null;
        this.looping = false;
        this.justLooped = false;
    }

    onTick(event)
    {
        if (this.looping)
        {
            if (this.videoElement.currentTime >= this.b)
            {
                this.justLooped = true;
                this.videoElement.currentTime = this.a;
            }
        }
    }

    onSeek(event)
    {
        if (!this.justLooped)
        {
            this.clear();
        }
        this.justLooped = false;
    }

    getState()
    {
        return {
            a: this.a,
            b: this.b
        }
    }
}

const video = document.querySelector("video");
const looper = new ABLooper(video);

const stateSender = new MessageSender("PopupStateSlot");

const pageInputSlot = new MessageSlot(
    "PageInputSlot",
    function(message)
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
);

const pageStateSlot = new MessageSlot(
    "PageStateSlot",
    function()
    {
        stateSender.sendToRuntime(looper.getState());
    }
)