class ABLooper
{
    constructor(videoElement)
    {
        this.videoElement = videoElement;
        this.a = null;
        this.b = null;
        this.looping = false;

        this.videoElement.addEventListener("timeupdate", this.onTick.bind(this));
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

    onTick(event)
    {
        if (this.looping)
        {
            if (this.videoElement.currentTime >= this.b)
            {
                this.videoElement.currentTime = this.a;
            }
        }
    }
}

const video = document.querySelector("video");
const looper = new ABLooper(video);

const slot = new MessageSlot(
    "Page",
    function(message)
    {
        switch (message)
        {
            case "a":
                looper.placeA();
            break;

            case "b":
                looper.placeB();
            break;
        }
    }
);