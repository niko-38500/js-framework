import Binding from "./binding.js";

export default class BinderCondition {
    conditionArgs: string[] = [];

    getParameters(binding: Binding) {
        const regexSymbole = new RegExp(/(===?|!==?|<=?|>=?|\|\||&&)/);
        const condition = binding.property.split(regexSymbole);

        condition.forEach((element: string) => {
            if (!/".*"/.test(element) && !regexSymbole.test(element)) {
                const arg = element.trim();
                const context = (binding.context as any);

                // if (!context.hasOwnProperty(arg)) {
                //     throw `${arg} is not a property of ${context.constructor.name}:
                //      on \<${binding.element.localName} bind="if: ${condition.join("")}"\>`;
                // }

                this.conditionArgs.push(arg);
            }
        });
    }
}