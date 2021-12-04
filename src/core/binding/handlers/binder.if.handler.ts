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
            if (/".*"/.test(element) || regexSymbole.test(element)) {
                parsedCondition += `${element.trim()} `;
                return;
            }
            parsedCondition += typeof (binding.context as any)[element.trim()] === 'boolean'
                ? `${(binding.context as any)[element.trim()]} `
                : `"${(binding.context as any)[element.trim()]}" `;
        });
        const isTrue = eval(parsedCondition);
        if (isTrue) {
            (binding.element as HTMLElement).style.display = this.display;
            return;
        }
        (binding.element as HTMLElement).style.display = "none";
    }
}