import ViewModel from "../component/view.model.js";
import Binder from "./binder.js";
import BindingInterface from "./interfaces/binding.interface.js";
import {SubscriptionsInterface} from "./interfaces/subscriptions.interface";

export default class Binding implements BindingInterface {
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
        Binder.redefine(this.context);
        const binderHandler = Object.create((Binder.handlers as any)[this.handler]);
        binderHandler.bind(this);
    }

    unbind(): void {
        Binder.getSubscriptions().forEach((subscription: SubscriptionsInterface) => {
            const key = subscription.param;
            Binder.unsubscribe(key);
        })
    }

    setValue(value: string | boolean | number): void {
        if (/[\[\]]+/.test(this.property)) {

            const splitArg = this.property.split(/([\[|\]])/g);
            const args = this.property.split(/[\[\]]/g).filter(e => e !== '');
            let context = (this.context as any);
            args.map((arg: any, i: number) => {
                if (i + 1 === args.length) {
                    context[arg] = value;
                    return;
                }
                context = context[arg]
            });
            return;
        }
        (this.context as any)[this.property] = value;
    }

    getValue(): any {
        if (/[\[\]]+/.test(this.property)) {
            const splitArg = this.property.split(/[\[|\]]/);
            let value = "";

            splitArg.forEach((e: string, index: number) => {
                if ("" === e || /[\[|\]]/.test(e)) return;
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