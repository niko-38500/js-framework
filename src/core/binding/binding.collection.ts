import Binding from "./binding.js";
import ViewModel from "../component/view.model.js";

export default class BindingCollection {
    bindingCollection: { [key:string]: Binding[] } = {};

    addBinding(elements: Element, context: ViewModel): void {
        const component = Object.getPrototypeOf(context).constructor.name;
        (this.bindingCollection as any)[component] = [];
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