import Binding from "../binding.js";
import BinderLoop from "../binder.loop.js";
import Binder from "../binder.js";

export default class BinderForHandler extends BinderLoop {
    loopAlias!: string;
    loopType!: string;
    loopContext!: string;
    bind(binding: Binding) {
        const loopArgs = binding.property.split(/(in|on)/);
        this.loopAlias = loopArgs[0].trim();
        this.loopType = loopArgs[1].trim();
        this.loopContext = loopArgs[2].trim();

        Binder.subscribe(this.loopContext, () => {
            this.update(binding);
        })

        this.update(binding);
    }

    update(binding: Binding) {
        const element = binding.element as HTMLElement;
        switch (this.loopType) {
            case "in":
                const context: any[] = (binding.context as any)[this.loopContext];

                if (!Array.isArray(context)) throw `error: property ${this.loopContext} in ${binding.context.constructor.name} is not of type array: ${binding.element.localName}`;

                let elements: HTMLElement[] = [];

                context.forEach((unused: any, i: number) => {
                    const wrapper = document.createElement("div");
                    wrapper.innerHTML = element.outerHTML;
                    const bindings = (wrapper.firstChild as HTMLElement).querySelectorAll(`[bind]`);

                    bindings.forEach((el: Element) => {
                        const regexParser = new RegExp(`(?:^|\\W)${this.loopAlias}(?:$|\\W)`);
                        const attribute = el.getAttribute("bind")!;
                        const matchedAlias = attribute.match(regexParser)![0];
                        if (matchedAlias) {
                            const deepRegex = new RegExp(`(?:^|\\W)${this.loopAlias}(\.[0-9a-zA-Z]+?)+`);
                            let formattedAttr = "";
                            const properties = attribute.split(":")[1].trim();
                            if (deepRegex.test(properties)) {
                                const match = properties.match(deepRegex)![0];
                                const splitArg = match.split(".");
                                let parsedArg = "";
                                parsedArg = `${this.loopContext}[${i}][${splitArg[1]}]`
                                for (let index = 2; index < splitArg.length; index++) {
                                    parsedArg = `${parsedArg}[${splitArg[index]}]`;
                                }
                                formattedAttr = attribute.replace(deepRegex, ` ${parsedArg} `);
                                el.removeAttribute('bind');
                                el.setAttribute("bind", formattedAttr)
                                return;
                            }
                            formattedAttr = attribute.replace(matchedAlias, ` ${this.loopContext}[${i}] `);
                            el.removeAttribute('bind');
                            el.setAttribute("bind", formattedAttr)
                        }
                    })
                    elements.unshift((wrapper.firstChild as HTMLElement));
                });

                elements.forEach((e: HTMLElement, i: number) => {
                    if (elements.length === i + 1) {
                        element.replaceWith(e);
                        return;
                    }
                    element.after(e);
                })
                break;
        }
    }
}