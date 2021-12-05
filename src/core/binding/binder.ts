import {SubscriptionsInterface} from "./interfaces/subscriptions.interface.js";
import ViewModel from "../component/view.model.js";
import BinderValueHandler from "./handlers/binder.value.handler.js";
import BinderTextHandler from "./handlers/binder.text.handler.js";
import BinderIfHandler from "./handlers/binder.if.handler.js";
import BinderForHandler from "./handlers/binder.for.handler.js";

export default abstract class Binder {
    static subscriptions: SubscriptionsInterface[] = [];
    static context: ViewModel;
    static handlers = {
        value: new BinderValueHandler(),
        text: new BinderTextHandler(),
        if: new BinderIfHandler(),
        for: new BinderForHandler(),
    };
    // TODO : when a new subscriptions is set verify if the property is already observed

    static redefine(handler: string) {
        const keys = Object.keys(this.context);
        keys.forEach((key: string) => {
            let value = (this.context as any)[key];
            delete (this.context as any)[key];
            Object.defineProperty(this.context, key, {
                get() {
                    return value;
                },
                set(newValue: string): void {
                    const shouldUpdate = newValue !== value;
                    value = newValue;
                    if (shouldUpdate) {
                        Binder.notify(key);
                    }
                }
            })
        });
    }

    static subscribe(key: string, callback: () => any): void {
        this.subscriptions.push({
            param: key,
            callback: callback
        });
    }

    static unsubscribe(key: string): void {
        this.subscriptions = this.subscriptions.filter((subscription: SubscriptionsInterface) => {
            return key !== subscription.param
        });
    }

    static notify(params: string): void {
        // if (Object.getOwnPropertyDescriptor(this.subscriptions, params))
        const subscriptions = this.subscriptions.filter((subscription: SubscriptionsInterface) => {
            return subscription.param === params
        });
        subscriptions.forEach((subscription: SubscriptionsInterface) => {
            subscription.callback();
        });
    }

    static getSubscription(): SubscriptionsInterface[] {
        return this.subscriptions;
    }
}