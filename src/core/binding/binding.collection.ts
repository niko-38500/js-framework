import Binding from "./binding.js";
import ViewModel from "../component/view.model.js";
import BindingEvent from "./binding.event.js";
import BinderEventInterface from "./interfaces/binder.event.interface.js";

export default class BindingCollection {
    bindingCollection: { [key:string]: Binding[] } = {};

    addBinding(elements: Element, context: ViewModel): void {
        const component = Object.getPrototypeOf(context).constructor.name;
        (this.bindingCollection as any)[component] = [];

        elements.querySelectorAll('[html-dynamic-event]').forEach((htmlEvent: Element) => {
            const parameterEvent = htmlEvent.getAttribute("html-dynamic-event")!;
            const event = parameterEvent.split(":")[0];
            const callback = parameterEvent.split(":")[1];
            if (!(context as any)[callback]) {
                throw `error: ${callback} is not a method of ${context.constructor.name}`
            }

            const eventBinder: BinderEventInterface = {
                element: htmlEvent,
                event: event,
                callback: (context as any)[callback],
                context: context
            }

            const bindingEvent = new BindingEvent();
            bindingEvent.addEvent(eventBinder);
        })

        elements.querySelectorAll('[lb-for]').forEach((element: Element) => {
            const callback = element.getAttribute("lb-for")!;
            const binding = new Binding(callback, "for", element, context);
            (this.bindingCollection as any)[component].push(binding);
            binding.bind();
        });

        elements.querySelectorAll('[bind]').forEach((element: Element) => {
            const binder = element.getAttribute("bind")!.split(":");
            const handler = binder[0].trim();
            const callback = binder[1].trim();
            const binding = new Binding(callback, handler, element, context);
            (this.bindingCollection as any)[component].push(binding);
            binding.bind();
        });
    }
}