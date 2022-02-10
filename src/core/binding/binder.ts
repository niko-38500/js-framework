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
        for: new BinderForHandler,
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
                    const objectKey = accessor
                        ? `${accessor}[${key}]`
                        : key;
                    let value = context[key];

                    delete context[key]
                    if (Array.isArray(value)) {
                        Object.defineProperty(context, key, {
                            get() {
                                return value;
                            },
                            set(newValue: any): void {
                                if (newValue instanceof Object) {
                                    for (const prop in newValue) {
                                        const o = JSON.parse(JSON.stringify(newValue))
                                        Object.defineProperty(newValue, prop, {
                                            get(): any {
                                                return o[prop]
                                            },
                                            set(newValu: any) {
                                                newValu[prop] = newValue;
                                            }
                                        })
                                    }
                                    newValue.isNew = true;
                                }
                                value.push(newValue);

                                Binder.notify(objectKey);
                            }
                        })
                        return;
                    }
                    Object.defineProperty(context, key, {
                        get() {
                            return value;
                        },
                        set(newValue: string): void {
                            const shouldUpdate = newValue !== value;
                            value = newValue;
                            if (shouldUpdate) {
                                Binder.notify(objectKey);
                            }
                        }
                    })
                }
            })
        }
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
        const subscriptions = this.subscriptions.filter((subscription: SubscriptionsInterface) => {
            return subscription.param === params
        });
        subscriptions.forEach((subscription: SubscriptionsInterface) => {
            subscription.callback();
        });
    }

    static getSubscriptions(): SubscriptionsInterface[] {
        return this.subscriptions;
    }
}