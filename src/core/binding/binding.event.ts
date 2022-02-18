import { BinderEventInterface } from "./interfaces/binder.event.interface";
import { BindingInterface } from "./interfaces/binding.interface";

export class BindingEvent implements BindingInterface { // TODO verify if events are separated for each components
    private callback!: () => any | void;
    private event!: BinderEventInterface;

    bind(event: BinderEventInterface) {
        this.event = event;
        this.callback = event.callback.bind(event.context);
        this.event.element.addEventListener(this.event.event, this.callback, true);
    }

    unbind(): void {
        this.event.element.removeEventListener(this.event.event, this.callback, true);
    }
}