import BinderEventInterface from "./interfaces/binder.event.interface.js";

export default class BindingEvent {
    private events: any[] = [];

    addEvent(event: any) {
        this.events.push(event);
        event.element.addEventListener(event.event, event.callback.bind(event.context));
    }

    getEvents(): BinderEventInterface[] {
        return this.events;
    }

    clearEvents(): void {
        this.events.forEach((event: any) => {
            event.element.removeEventListener(event.event, event.callback.bind(event.context));
        })
        this.events = [];
    }
}