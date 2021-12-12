import {SubscriptionsInterface} from "./interfaces/subscriptions.interface.js";
import ViewModel from "../component/view.model.js";
import BinderValueHandler from "./handlers/binder.value.handler.js";
import BinderTextHandler from "./handlers/binder.text.handler.js";
import BinderIfHandler from "./handlers/binder.if.handler.js";
import BinderForHandler from "./handlers/binder.for.handler.js";

export default abstract class Binder {
    static subscriptions: SubscriptionsInterface[] = [];
    static context: ViewModel; // delete
    static test: any;
    static handlers = {
        value: new BinderValueHandler(),
        text: new BinderTextHandler(),
        if: new BinderIfHandler(),
        for: new BinderForHandler(),
    };
    // TODO : when a new subscriptions is set verify if the property is already observed

    static redefine(context: any, accessor: any = null) {
        const keys = Object.keys(context);
        if (keys) {
            keys.forEach((key: string) => {
                if (context.hasOwnProperty(key)) {
                    if (context[key] instanceof Array) {
                        context[key].forEach((e: any, i: number) => {
                            if (context[key][i] instanceof Object) {
                                if (accessor) {
                                    this.redefine(context[key][i], `${accessor}[${key}][${i}]`);
                                } else {
                                    this.redefine(context[key][i], `${key}[${i}]`);
                                }
                            }
                        })
                    } else if (context[key] instanceof Object) {
                        if (accessor) {
                            this.redefine(context[key], `${accessor}[${key}]`);
                        } else {
                            this.redefine(context[key]);
                        }
                    }
                    const e = accessor
                        ? `${accessor}[${key}]`
                        : key;
                    let value = context[key];
                    delete context[key]
                    Object.defineProperty(context, key, {
                        get() {
                            return value;
                        },
                        set(newValue: string): void {
                            const shouldUpdate = newValue !== value;
                            value = newValue;
                            if (shouldUpdate) {
                                console.log(e)
                                Binder.notify(e);
                            }
                        }
                    })
                }
            })
        }

        /*
        const keys = Object.keys(this.context);
        keys.forEach((key: string) => {
            let value = (this.context as any)[key];
            delete (this.context as any)[key];
            Object.defineProperty(this.context, key, {
                get() {
                    return value;
                },
                set(newValue: string): void {
                    console.log("sdgf");
                    const shouldUpdate = newValue !== value;
                    value = newValue;
                    if (shouldUpdate) {
                        Binder.notify(key);
                    }
                }
            })
        });

         */
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