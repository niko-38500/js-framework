import Router from "../routing/router.js";
import BindingNavigationInterface from "./interfaces/binding.navigation.interface.js";
import BindingInterface from "./interfaces/binding.interface.js";

export default class BindingNavigation implements BindingInterface {
    private element: Element;
    private navigateElements: NodeList;
    private readonly router?: Router;
    private callback!: () => void | any;
    private event!: BindingNavigationInterface;

    constructor(element: Element, navigateElements: NodeList) {
        this.element = element;
        this.router = Router.getInstance()
            ? Router.getInstance()
            : undefined;
        this.navigateElements = navigateElements;
    }

    bind(): void {
        if (!this.router) return;

        this.navigateElements.forEach((element: Node) => {
            const view = element as HTMLElement;
            const callback = () => {
                this.router?.navigate(view.getAttribute('navigate')!);
            }

            const eventBinder: BindingNavigationInterface = {
                element: view,
                event: 'click',
                callback: callback,
                context: this.router!,
            }
            this.event = eventBinder;
            this.callback = this.event.callback.bind(eventBinder.context)
            eventBinder.element.addEventListener('click', this.callback);
        })
    }

    unbind(): void {
        this.event.element.removeEventListener('click', this.callback);
    }
}