import Binding from "../binding.js";
import Binder from "../binder.js";
import BinderCondition from "../binder.condition.js";

export default class BinderIfHandler extends BinderCondition {
    display!: string;

    bind(binding: Binding) {
        this.display = (binding.element as HTMLElement).style.display;
        this.getParameters(binding);
        this.conditionArgs.forEach((arg: string) => {
            Binder.subscribe(arg, () => {
                this.update(binding);
            });
        })
        this.update(binding);
    }

    unbind(binding: Binding) {
    }

    update(binding: Binding) {
        const regexSymbole = new RegExp(/(===?|!==?|<=?|>=?|\|\||&&)/)
        const condition = binding.property.split(regexSymbole);
        let parsedCondition = "";

        condition.forEach((element: string) => {
            element = element.trim();

            if (/".*"/.test(element) || regexSymbole.test(element) || /^[0-9]+$/.test(element)) {
                parsedCondition += `${element} `;
                return;
            }

            if (/[\[\]]+/.test(element)) {
                const splitArg = element.split(/(\[|])/);
                let value: any;

                splitArg.forEach((e: string, index: number) => {
                    if ("" === e || /(\[|])/.test(e)) return;
                    if (0 === index) {
                        value = (binding.context as any)[e];
                        return;
                    }
                    value = (value as any)[e];
                })

                parsedCondition += typeof value === "number" || typeof value === "boolean"
                    ? `${value} `
                    : `"${value}" `;

                return;
            } else if (typeof (binding.context as any)[element] === 'boolean') {
                parsedCondition += `${(binding.context as any)[element]} `;
                return;
            }
            parsedCondition += `"${(binding.context as any)[element]}" `;
        });
        const isTrue = eval(parsedCondition);
        if (isTrue) {
            (binding.element as HTMLElement).style.display = this.display;
            return;
        }
        (binding.element as HTMLElement).style.display = "none";
    }
}