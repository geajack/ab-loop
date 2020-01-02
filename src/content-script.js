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
        video.addEventListener("seeking", this.onSeek.bind(this));
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
}

const video = document.querySelector("video");
const looper = new ABLooper(video);

const background = new MessageSender("Background");

const slot = new MessageSlot(
    "Page",
    function(message)
    {
        switch (message)
        {
            case "a":
                looper.placeA();
                background.sendToRuntime("set-a");
            break;

            case "b":
                looper.placeB();
                background.sendToRuntime("set-b");
            break;

            case "clear":
                looper.clear();
                background.sendToRuntime("clear");
            break;
        }
    }
);