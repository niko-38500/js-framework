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
        if (/[\[\]]+/.test(this.property)) {
            const splitArg = this.property.split(/(\[|])/);
            let value = "";

            splitArg.forEach((e: string, index: number) => {
                if ("" === e || /(\[|])/.test(e)) return;
                if (0 === index) {
                    value = (Binder.context as any)[e];
                    return;
                }
                value = (value as any)[e];
            })

            return value;
        }
        return (Binder.context as any)[this.property];
    }
}