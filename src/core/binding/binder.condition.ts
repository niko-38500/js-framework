import Binding from "./binding.js";

export default class BinderCondition {
    conditionArgs: string[] = [];

    getParameters(binding: Binding) {
        const regexSymbole = new RegExp(/(===?|!==?|<=?|>=?|\|\||&&)/);
        const condition = binding.property.split(regexSymbole);

        condition.forEach((element: string) => {
            if (!/".*"/.test(element) && !regexSymbole.test(element)) {
                this.conditionArgs.push(element.trim());
            }
        });
    }
}