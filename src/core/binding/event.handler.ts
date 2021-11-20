import BinderEventInterface from "./binder.event.interface.js";

export default class EventHandler {
    private events: BinderEventInterface[] = [];

    addEvent(event: BinderEventInterface) {
        this.events.push(event);
        event.element.addEventListener(event.event, event.callback);
    }

    getEvents(): BinderEventInterface[] {
        return this.events;
    }

    clearEvents(): void {
        this.events.forEach((event: BinderEventInterface) => {
            event.element.removeEventListener(event.event, event.callback);
        })
        this.events = [];
    }
}