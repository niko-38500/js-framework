import { Binding } from '../binding';
import { BinderLoop } from '../binder.loop';
import { Binder } from '../binder';
import { BindingCollection } from '../binding.collection';

export class BinderForHandler extends BinderLoop {
    loopAlias!: string;
    loopType!: string;
    loopContext!: string;
    loopedElements!: Node;
    isUpdated = false;

    bind(binding: Binding) {
        const loopArgs = binding.property.split(/(in|on)/);
        this.loopAlias = loopArgs[0].trim();
        this.loopType = loopArgs[1].trim();
        this.loopContext = loopArgs[2].trim();
        this.loopedElements = binding.element.cloneNode(true);

        Binder.subscribe(this.loopContext, () => {
            this.update(binding);
        });

        this.update(binding);
    }

    findChild(elements: HTMLCollection, i: number) {
        for (const elem of Array.from(elements)) {
            if (0 !== elem.children.length) {
                this.findChild(elem.children, i);
            }
            this.parseBindAttribute(elem, i);
        }
    }

    update(binding: Binding) {
        const element = binding.element as HTMLElement;

        switch (this.loopType) {
        case 'in':
            const context: any[] = (binding.context as any)[this.loopContext];
            const isArrayOfObject = context[0] instanceof Object;

            if (!Array.isArray(context)) throw `error: property ${this.loopContext} in ${binding.context.constructor.name} is not of type array: ${binding.element.localName}`;

            const elements: HTMLElement[] = [];
            let updatedElement: HTMLElement[] = [];
            context.forEach((occurrence: any, i: number) => {
                const wrapper = ((this.loopedElements as HTMLElement).cloneNode(true) as HTMLElement);
                const bindings = wrapper.children;
                let elementIndex = 1;

                for (let el of Array.from(bindings)) {
                    if (0 !== el.children.length) {
                        this.findChild(el.children, i);
                    }
                    if (
                        this.isUpdated &&
                            occurrence instanceof Object &&
                            !Object.getOwnPropertyDescriptor(occurrence, 'isNew')
                    ) {
                        ++elementIndex;
                        continue;
                    }

                    if (this.isUpdated) {
                        if (occurrence instanceof Object) {
                            if (elementIndex === bindings.length) delete occurrence.isNew;
                        }
                        updatedElement.push((el as HTMLElement));
                    }

                    if (!el.hasAttribute('bind')) {
                        console.log(el);
                        ++elementIndex;
                        continue;
                    }

                    el = this.parseBindAttribute(el, i);
                    ++elementIndex;
                }
                for (const i of Array.from(wrapper.children)) {
                    elements.push((i as HTMLElement));
                }
            });

            if (!isArrayOfObject) {
                element.innerHTML = '';
            }

            if (!this.isUpdated) {
                element.innerHTML = '';
                elements.forEach((e: HTMLElement) => {
                    element.append(e);
                });
                binding.element = element;
                this.isUpdated = true;
            } else {
                const binder = BindingCollection.getInstance();

                const bindRecursively = (subElements: HTMLCollection) => {
                    for (const subElement of Array.from(subElements)) {
                        if (0 !== subElement.children.length) {
                            bindRecursively(subElement.children);
                        }
                        if (subElement.hasAttribute('bind')) {
                            const handler = subElement.getAttribute('bind')!.split(':')[0].trim();
                            const property = subElement.getAttribute('bind')!.split(':')[1].trim();

                            binder.addSingleBinding(property, handler, (subElement as HTMLElement), binding.context);
                        }
                    }
                };
                updatedElement.forEach((newElement: HTMLElement) => {
                    if (!newElement.hasAttribute('bind') && 0 !== newElement.children.length) {
                        bindRecursively(newElement.children);
                    }
                    updatedElement = updatedElement.filter(e => e !== newElement);
                    if (newElement.hasAttribute('bind')) {
                        const {split} = newElement.getAttribute('bind')!;
                        const handler = split(':')[0].trim();
                        const property = split(':')[1].trim();

                        binder.addSingleBinding(property, handler, newElement, binding.context);
                    }

                    element.appendChild(newElement);
                });
            }
            break;
        }
    }

    private parseBindAttribute(el: Element, i: number) {
        const regexLoopAlias = new RegExp(`(?:^|\\W)${this.loopAlias}(?:$|\\W)`);
        const attribute = el.getAttribute('bind')!;
        const matchedAlias = attribute.match(regexLoopAlias)![0];
        if (matchedAlias) {
            const deepRegex = new RegExp(`(?:^|\\W)${this.loopAlias}(\.[0-9a-zA-Z]+)+`);
            let formattedAttr: string;
            const properties = attribute.split(':')[1].trim();
            if (deepRegex.test(properties)) {
                const match = properties.match(deepRegex)![0];
                const splitArg = match.split('.');
                let parsedArg: string;
                parsedArg = `${this.loopContext}[${i}][${splitArg[1]}]`;
                for (let index = 2; index < splitArg.length; index++) {
                    parsedArg = `${parsedArg}[${splitArg[index]}]`;
                }
                formattedAttr = attribute.replace(deepRegex, ` ${parsedArg} `);
            } else {
                formattedAttr = attribute.replace(matchedAlias, ` ${this.loopContext}[${i}] `);
            }
            el.removeAttribute('bind');
            el.setAttribute('bind', formattedAttr);
        }
        return el;
    }
}