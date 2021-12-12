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
        Binder.redefine(this.context);

        const binderHandler = (Binder.handlers as any)[this.handler];
        binderHandler.bind(this);
    }

    setValue(value: string | boolean | number): void {

        const clone = (obj: any): any => {
            let buf; // the cloned object
            if (obj instanceof Array) {
                buf = []; // create an empty array
                let i = obj.length;
                while (i --) {
                    buf[i] = clone(obj[i]); // recursively clone the elements
                }
                return buf;
            } else if (obj instanceof Object) {
                buf = {}; // create an empty object
                for (const k in obj) {
                    if (obj.hasOwnProperty(k)) { // filter out another array's index
                        (buf as any)[k] = clone(obj[k]); // recursively clone the value
                    }
                }
                return buf;
            } else {
                return obj;
            }
        }






        if (/[\[\]]+/.test(this.property)) {

            const splitArg = this.property.split(/([\[|\]])/g);
            const accessor = splitArg[0];
            // splitArg.shift();
            // const args = splitArg.join('');
            // let full = `[${accessor}]${args}`;
            const args = this.property.split(/[\[\]]/g).filter(e => e !== '');
            let ctx = (this.context as any);
            args.map((e: any, i: number) => {
                if (i + 1 === args.length) {
                    ctx[e] = value;
                    return;
                }
                ctx = ctx[e]
            });
            // console.log(b);
            // filteredArray.forEach((e: string, i: number) => {
            //     if (filteredArray.length === i + 1) {
            //         console.log(this.property);
            //         (this.context as any)[accessor][i][e] = value;
            //         return;
            //     }
            //
            // });
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