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