import BindingEvent from "../binding/binding.event.js";

export default class ViewModel {
    onInit() {}
    onLoaded() {}
    onDestroy() {}

    bindHtmlEvent(component: HTMLElement) {
        component.querySelectorAll('[html-dynamic-event]').forEach((htmlEvent: Element) => {
            const parameterEvent = htmlEvent.getAttribute("html-dynamic-event")!;
            const event = parameterEvent.split(":")[0].trim();
            const method = parameterEvent.split(":")[1].trim();
            if (!(this as any)[method]) {
                throw `error: ${method} is not a method of ${this.constructor.name}`
            }

            const eventBinder: any = {
                element: htmlEvent,
                event: event,
                callback: method,
                context: this
            }

            const bindingEvent = new BindingEvent();
            bindingEvent.addEvent(eventBinder);
        })
    }
}