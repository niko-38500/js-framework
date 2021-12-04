import ViewModel from "../component/view.model.js";
import Binder from "./binder.js";

export default class Binding {
    property: string;
    handler: string;
    element: Element;
    context: ViewModel;

    constructor(property: string, handler: string, element: Element, context: ViewModel) {
        this.property = property;
        this.handler = handler;
        this.element = element;
        this.context = context;
    }

    bind(): void {
        Binder.context = this.context;
        Binder.redefine(this.handler);

        const binderHandler = (Binder.handlers as any)[this.handler];
        binderHandler.bind(this);
    }

    setValue(value: string | boolean | number): void {
        (this.context as any)[this.property] = value;
    }

    getValue(): any {
        return (Binder.context as any)[this.property];
    }
}