export default class Event
{
    constructor()
    {
        this.listeners = [];
    }

    addListener(listener)
    {
        this.listeners.push(listener);
    }

    fire(data)
    {
        for (let listener of this.listeners)
        {
            listener(data);
        }
    }
}